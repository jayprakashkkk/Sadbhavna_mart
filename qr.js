/* Lightweight pure-JS Byte-mode QR Code SVG renderer (ISO/IEC 18004, Versions 1-10, ECC-L/M) */
(function (global) {
  var EXP = new Array(512);
  var LOG = new Array(256);
  for (var i = 0, v = 1; i < 255; i++) {
    EXP[i] = v;
    LOG[v] = i;
    v <<= 1;
    if (v & 0x100) v ^= 0x11d;
  }
  for (var j = 255; j < 512; j++) EXP[j] = EXP[j - 255];

  function gfMul(a, b) {
    return a === 0 || b === 0 ? 0 : EXP[LOG[a] + LOG[b]];
  }

  function polyMul(p, q) {
    var r = new Array(p.length + q.length - 1).fill(0);
    for (var i = 0; i < p.length; i++) {
      for (var j = 0; j < q.length; j++) r[i + j] ^= gfMul(p[i], q[j]);
    }
    return r;
  }

  function rsGenPoly(deg) {
    var g = [1];
    for (var i = 0; i < deg; i++) g = polyMul(g, [1, EXP[i]]);
    return g;
  }

  function rsEncode(data, ecLen) {
    var gen = rsGenPoly(ecLen);
    var res = data.slice().concat(new Array(ecLen).fill(0));
    for (var i = 0; i < data.length; i++) {
      var coef = res[i];
      if (coef !== 0) {
        for (var j = 0; j < gen.length; j++) res[i + j] ^= gfMul(gen[j], coef);
      }
    }
    return res.slice(data.length);
  }

  // Versions 1-10, ECC Level M: [totalDataCodewords, ecPerBlock, blocksG1, dataG1, blocksG2, dataG2]
  var VERSIONS_M = [
    null,
    [16, 10, 1, 16, 0, 0],
    [28, 16, 1, 28, 0, 0],
    [44, 26, 1, 44, 0, 0],
    [64, 18, 2, 32, 0, 0],
    [86, 24, 2, 43, 0, 0],
    [108, 16, 4, 27, 0, 0],
    [124, 18, 4, 31, 0, 0],
    [154, 22, 2, 38, 2, 39],
    [182, 22, 3, 36, 2, 37],
    [216, 26, 4, 43, 1, 44]
  ];

  var ALIGN_POS = [
    [], [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34],
    [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50]
  ];

  function chooseVersion(byteLen) {
    for (var v = 1; v < VERSIONS_M.length; v++) {
      var capBytes = VERSIONS_M[v][0];
      var countBits = v < 10 ? 8 : 16;
      var neededBits = 4 + countBits + byteLen * 8;
      if (neededBits <= capBytes * 8) return v;
    }
    return 10;
  }

  function makeCodewords(bytes, version) {
    var spec = VERSIONS_M[version];
    var totalData = spec[0];
    var bits = [];
    function pushBits(val, len) {
      for (var i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1);
    }
    pushBits(4, 4); // Byte mode
    pushBits(bytes.length, version < 10 ? 8 : 16);
    for (var i = 0; i < bytes.length; i++) pushBits(bytes[i], 8);
    var capBits = totalData * 8;
    pushBits(0, Math.min(4, capBits - bits.length));
    while (bits.length % 8 !== 0) bits.push(0);
    var pads = [0xec, 0x11], pi = 0;
    while (bits.length < capBits) {
      pushBits(pads[pi++ & 1], 8);
    }
    var dataCw = [];
    for (var b = 0; b < bits.length; b += 8) {
      var byteVal = 0;
      for (var k = 0; k < 8; k++) byteVal = (byteVal << 1) | bits[b + k];
      dataCw.push(byteVal);
    }

    var ecLen = spec[1], g1B = spec[2], g1D = spec[3], g2B = spec[4], g2D = spec[5];
    var dataBlocks = [], ecBlocks = [], offset = 0;
    for (var i1 = 0; i1 < g1B; i1++) {
      var blk1 = dataCw.slice(offset, offset + g1D);
      offset += g1D;
      dataBlocks.push(blk1);
      ecBlocks.push(rsEncode(blk1, ecLen));
    }
    for (var i2 = 0; i2 < g2B; i2++) {
      var blk2 = dataCw.slice(offset, offset + g2D);
      offset += g2D;
      dataBlocks.push(blk2);
      ecBlocks.push(rsEncode(blk2, ecLen));
    }

    var out = [];
    var maxD = Math.max(g1D, g2D);
    for (var d = 0; d < maxD; d++) {
      for (var bl = 0; bl < dataBlocks.length; bl++) {
        if (d < dataBlocks[bl].length) out.push(dataBlocks[bl][d]);
      }
    }
    for (var e = 0; e < ecLen; e++) {
      for (var bl2 = 0; bl2 < ecBlocks.length; bl2++) out.push(ecBlocks[bl2][e]);
    }
    return out;
  }

  function bchFormat(data5) {
    var d = data5 << 10;
    while (d >= (1 << 10)) {
      var shift = Math.floor(Math.log2(d)) - 10;
      d ^= 0x537 << shift;
    }
    return ((data5 << 10) | d) ^ 0x5412;
  }

  function bchVersion(ver) {
    var d = ver << 12;
    while (d >= (1 << 12)) {
      var shift = Math.floor(Math.log2(d)) - 12;
      d ^= 0x1f25 << shift;
    }
    return (ver << 12) | d;
  }

  function buildMatrix(text) {
    var utf8 = unescape(encodeURIComponent(text));
    var bytes = [];
    for (var i = 0; i < utf8.length; i++) bytes.push(utf8.charCodeAt(i));

    var version = chooseVersion(bytes.length);
    var size = version * 4 + 17;
    var codewords = makeCodewords(bytes, version);

    var mod = Array.from({ length: size }, function () { return new Array(size).fill(null); });
    var isFunc = Array.from({ length: size }, function () { return new Array(size).fill(false); });

    function setFunc(r, c, val) {
      if (r >= 0 && r < size && c >= 0 && c < size) {
        mod[r][c] = val;
        isFunc[r][c] = true;
      }
    }

    function drawFinder(r0, c0) {
      for (var dr = -1; dr <= 7; dr++) {
        for (var dc = -1; dc <= 7; dc++) {
          var r = r0 + dr, c = c0 + dc;
          if (r < 0 || r >= size || c < 0 || c >= size) continue;
          var inOuter = dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6;
          var onBorder = dr === 0 || dr === 6 || dc === 0 || dc === 6;
          var inCore = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
          setFunc(r, c, inOuter && (onBorder || inCore) ? 1 : 0);
        }
      }
    }

    drawFinder(0, 0);
    drawFinder(0, size - 7);
    drawFinder(size - 7, 0);

    for (var t = 8; t < size - 8; t++) {
      setFunc(6, t, t % 2 === 0 ? 1 : 0);
      setFunc(t, 6, t % 2 === 0 ? 1 : 0);
    }

    var aligns = ALIGN_POS[version];
    for (var a = 0; a < aligns.length; a++) {
      for (var b = 0; b < aligns.length; b++) {
        var ar = aligns[a], ac = aligns[b];
        if (isFunc[ar][ac]) continue;
        for (var dr = -2; dr <= 2; dr++) {
          for (var dc = -2; dc <= 2; dc++) {
            setFunc(ar + dr, ac + dc, (Math.max(Math.abs(dr), Math.abs(dc)) !== 1) ? 1 : 0);
          }
        }
      }
    }

    setFunc(size - 8, 8, 1);

    // Reserve format areas
    for (var f = 0; f < 9; f++) {
      if (f !== 6) {
        setFunc(8, f, 0);
        setFunc(f, 8, 0);
      }
    }
    for (var f2 = 0; f2 < 8; f2++) {
      setFunc(8, size - 1 - f2, 0);
      if (f2 < 7) setFunc(size - 1 - f2, 8, 0);
    }

    if (version >= 7) {
      var vb = bchVersion(version);
      for (var vi = 0; vi < 18; vi++) {
        var bit = (vb >>> vi) & 1;
        setFunc(Math.floor(vi / 3), size - 11 + (vi % 3), bit);
        setFunc(size - 11 + (vi % 3), Math.floor(vi / 3), bit);
      }
    }

    // Place data bits
    var allBits = [];
    for (var cw = 0; cw < codewords.length; cw++) {
      for (var bitIdx = 7; bitIdx >= 0; bitIdx--) allBits.push((codewords[cw] >>> bitIdx) & 1);
    }
    var bitPtr = 0, dir = -1;
    for (var col = size - 1; col >= 1; col -= 2) {
      if (col === 6) col--;
      for (var step = 0; step < size; step++) {
        var row = dir === -1 ? size - 1 - step : step;
        for (var dx = 0; dx < 2; dx++) {
          var cc = col - dx;
          if (!isFunc[row][cc]) {
            mod[row][cc] = bitPtr < allBits.length ? allBits[bitPtr++] : 0;
          }
        }
      }
      dir = -dir;
    }

    // Choose best mask (0-7)
    var bestMask = 0, bestPenalty = Infinity;
    function maskCond(m, r, c) {
      switch (m) {
        case 0: return (r + c) % 2 === 0;
        case 1: return r % 2 === 0;
        case 2: return c % 3 === 0;
        case 3: return (r + c) % 3 === 0;
        case 4: return (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0;
        case 5: return ((r * c) % 2 + (r * c) % 3) === 0;
        case 6: return (((r * c) % 2 + (r * c) % 3) % 2) === 0;
        default: return (((r + c) % 2 + (r * c) % 3) % 2) === 0;
      }
    }

    for (var m = 0; m < 8; m++) {
      var test = mod.map(function (rowArr, r) {
        return rowArr.map(function (val, c) {
          return (!isFunc[r][c] && maskCond(m, r, c)) ? (val ^ 1) : val;
        });
      });
      // Rough penalty check (runs + 2x2 blocks + balance)
      var pen = 0, dark = 0;
      for (var r = 0; r < size; r++) {
        var run = 1;
        for (var c = 0; c < size; c++) {
          if (test[r][c]) dark++;
          if (c > 0 && test[r][c] === test[r][c - 1]) {
            run++;
            if (run === 5) pen += 3;
            else if (run > 5) pen += 1;
          } else run = 1;
          if (r < size - 1 && c < size - 1) {
            var s = test[r][c] + test[r][c + 1] + test[r + 1][c] + test[r + 1][c + 1];
            if (s === 0 || s === 4) pen += 3;
          }
        }
      }
      for (var c2 = 0; c2 < size; c2++) {
        var runC = 1;
        for (var r2 = 1; r2 < size; r2++) {
          if (test[r2][c2] === test[r2 - 1][c2]) {
            runC++;
            if (runC === 5) pen += 3;
            else if (runC > 5) pen += 1;
          } else runC = 1;
        }
      }
      pen += Math.abs(Math.round((dark * 100) / (size * size)) - 50) * 2;
      if (pen < bestPenalty) {
        bestPenalty = pen;
        bestMask = m;
      }
    }

    for (var r3 = 0; r3 < size; r3++) {
      for (var c3 = 0; c3 < size; c3++) {
        if (!isFunc[r3][c3] && maskCond(bestMask, r3, c3)) mod[r3][c3] ^= 1;
      }
    }

    // Write final format info (ECC M = 00 -> 0 << 3 | bestMask)
    var fmt = bchFormat((0 << 3) | bestMask);
    for (var k = 0; k < 15; k++) {
      var fBit = (fmt >>> k) & 1;
      if (k < 6) mod[8][k] = fBit;
      else if (k === 6) mod[8][7] = fBit;
      else if (k === 7) mod[8][8] = fBit;
      else if (k === 8) mod[7][8] = fBit;
      else mod[14 - k][8] = fBit;

      if (k < 7) mod[size - 1 - k][8] = fBit;
      else mod[8][size - 15 + k] = fBit;
    }

    return mod;
  }

  function renderQRSVG(text, pxSize) {
    var matrix = buildMatrix(text);
    var n = matrix.length;
    var quiet = 3;
    var full = n + quiet * 2;
    var size = pxSize || 180;
    var paths = [];
    for (var r = 0; r < n; r++) {
      for (var c = 0; c < n; c++) {
        if (matrix[r][c]) paths.push("M" + (c + quiet) + "," + (r + quiet) + "h1v1h-1z");
      }
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + full + ' ' + full + '" width="' + size + '" height="' + size + '" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#ffffff"/><path d="' + paths.join("") + '" fill="#020617"/></svg>';
  }

  global.SadbhavnaQR = {
    buildMatrix: buildMatrix,
    renderSVG: renderQRSVG
  };
})(window);
