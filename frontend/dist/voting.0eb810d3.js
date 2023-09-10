// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"voting.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plot_distro_manual = plot_distro_manual;
exports.plot_line_manual = plot_line_manual;
exports.plot_price_manual = plot_price_manual;
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var distro_raw_0 = [0, 0, 0, 0, 0];
var time_series_size = 365;
init_prices(0);
function init_prices(ini) {
  if (!window.net_line) window.net_line = "";

  //BTC, ETH, NEAR, SOL, USDC
  try {
    if (ini == 0) {
      window.price_btc = [];
      window.price_usd = [];
      window.price_eth = [];
      window.price_near = [];
      window.price_sol = [];
      window.time_all = [];
      window.rawFile = new XMLHttpRequest();
      rawFile.open("GET", "https://index.wedefin.com/stats_" + String(window.net_line) + String(0) + ".json" + "?" + String(Math.random()), false);
      rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
          if (rawFile.status === 200) {
            var allText = JSON.parse(rawFile.responseText);
            for (var i = 0; i < allText['prices'].length; i++) {
              var sdate = new Date(allText['prices'][i][0]);
              window.time_all.push(String(sdate.getDate()).padStart(2, '0') + "/" + String(sdate.getMonth() + 1).padStart(2, '0') + "/" + String(sdate.getFullYear()).slice(2, 4));
              window.price_btc.push(allText['prices'][i][3]);
              window.price_usd.push(allText['prices'][i][4]);
              window.price_eth.push(allText['prices'][i][5]);
              window.price_near.push(allText['prices'][i][6]);
              window.price_sol.push(allText['prices'][i][7]);
            }
          }
        }
      };
      rawFile.send(null);
    }
  } catch (_unused) {}
  ;
}
function plot_distro_manual(ini) {
  if (!window.asset_labels) window.asset_labels = ["NEAR", "BTC", "ETH", "SOL", "USDC"];
  if (!window.net_line) window.net_line = "";
  init_prices(ini);
  distro_raw_0 = window.distro_user;
  var labels_pie_voting = [];
  var assets_pie_voting = [];
  for (var i = 0; i < window.asset_labels.length; i++) {
    labels_pie_voting.push(window.asset_labels[i].toString() + " \u2022 " + ((Math.round(distro_raw_0[i]) / 10).toFixed(1) + '%').toString());
    assets_pie_voting.push((Math.round(distro_raw_0[i]) / 10).toFixed(1));
    document.getElementById('alloc' + String(i + 1)).innerHTML = String(assets_pie_voting[i]) + '%';
  }
  var ctx_string = 'voting_0_chart_1';
  var ctx = document.getElementById(ctx_string).getContext('2d');
  var chartStatus = Chart.getChart(ctx_string);
  if (chartStatus != undefined) {
    chartStatus.destroy();
  }
  ;
  var chart = new Chart(ctx, {
    type: 'doughnut',
    //    plugins: [ChartDataLabels],
    data: {
      labels: labels_pie_voting,
      datasets: [{
        //        data: [0.8, 0.5, 1.0, 1.2],
        data: assets_pie_voting,
        //        backgroundColor: ['#E2CF56', '#E256AE', '#56E289', '#5668E2'],
        backgroundColor: ['#fc890f', '#c8251a', '#04c976', '#444244', '#2362ae'],
        borderColor: '#FEFEFE',
        borderWidth: 2,
        offset: 0,
        hoverOffset: 4,
        rotation: -20,
        spacing: 0,
        borderRadius: 6
      }]
    },
    options: {
      animation: {
        duration: 0
      },
      //        aspectRatio: 1.77,
      radius: '80%',
      cutout: '80%',
      plugins: {
        tooltip: {
          callbacks: {
            label: function label(context) {
              var label = context.label;
              return label;
            }
          }
        },
        datalabels: {
          formatter: function formatter(value, ctx) {
            var sum = 0;
            var dataArr = ctx.chart.data.datasets[0].data;
            dataArr.map(function (data) {
              sum += data;
            });
            var percentage = (value * 100 / sum).toFixed(1) + "%";
            return percentage;
          },
          color: '#696969',
          align: 'end',
          offset: 15,
          font: {
            size: "12vw"
          }
        },
        legend: {
          display: false,
          position: 'right',
          labels: {
            font: {
              size: "12vw"
            },
            textAlign: 'left',
            boxWidth: 10,
            boxHeight: 10
          },
          title: {
            display: false,
            text: 'Your Proposal',
            font: {
              size: "14vw",
              weight: "normal"
            }
          }
        },
        title: {
          display: false,
          text: 'Your Proposal',
          padding: {
            top: 0,
            bottom: 0
          }
        }
      },
      layout: {
        padding: {
          top: 0,
          bottom: 0
        },
        autoPadding: true
      }
    }
  });
}
function plot_line_manual(ini) {
  if (!window.asset_labels) window.asset_labels = ["NEAR", "BTC", "ETH", "SOL", "USDC"];
  if (!window.net_line) window.net_line = "";
  init_prices(ini);
  distro_raw_0 = window.distro_user;
  var price_all_usd = [];
  var price_all_btc = [];
  var assets_pie_voting = [];
  for (var i = 0; i < window.asset_labels.length; i++) {
    assets_pie_voting.push((Math.round(distro_raw_0[i]) / 10).toFixed(1));
  }
  var price_0 = new Array(window.price_usd.length).fill(0);
  var price_1 = new Array(window.price_usd.length).fill(0);
  var price_2 = new Array(window.price_usd.length).fill(0);
  var price_3 = new Array(window.price_usd.length).fill(0);
  var price_4 = new Array(window.price_usd.length).fill(0);
  price_all_usd = new Array(window.price_usd.length).fill(0);
  var norm0 = window.price_btc[window.price_btc.length - time_series_size];
  var norm1 = window.price_usd[window.price_usd.length - time_series_size];
  var norm2 = window.price_eth[window.price_eth.length - time_series_size];
  var norm3 = window.price_near[window.price_near.length - time_series_size];
  var norm4 = window.price_sol[window.price_sol.length - time_series_size];
  for (var _i = 0; _i < window.price_usd.length; _i++) {
    price_0[_i] = (window.price_btc[_i] - 0 * norm0) / norm0;
    price_1[_i] = (window.price_usd[_i] - 0 * norm1) / norm1;
    price_2[_i] = (window.price_eth[_i] - 0 * norm2) / norm2;
    price_3[_i] = (window.price_near[_i] - 0 * norm3) / norm3;
    price_4[_i] = (window.price_sol[_i] - 0 * norm4) / norm4;
  }

  //["NEAR", "BTC", "ETH", "SOL", "USDC"]
  //['MATIC', 'BTC', 'ETH', 'LINK', 'USDC']
  for (var _i2 = 0; _i2 < window.price_usd.length; _i2++) {
    price_all_usd[_i2] = assets_pie_voting[1] * price_0[_i2] + assets_pie_voting[4] * price_1[_i2] + assets_pie_voting[2] * price_2[_i2] + assets_pie_voting[0] * price_3[_i2] + assets_pie_voting[3] * price_4[_i2];
  }
  price_all_btc = new Array(window.price_usd.length).fill(0);
  norm0 = window.price_btc[window.price_btc.length - time_series_size] / window.price_btc[window.price_btc.length - time_series_size];
  norm1 = window.price_usd[window.price_btc.length - time_series_size] / window.price_btc[window.price_btc.length - time_series_size];
  norm2 = window.price_eth[window.price_btc.length - time_series_size] / window.price_btc[window.price_btc.length - time_series_size];
  norm3 = window.price_near[window.price_btc.length - time_series_size] / window.price_btc[window.price_btc.length - time_series_size];
  norm4 = window.price_sol[window.price_btc.length - time_series_size] / window.price_btc[window.price_btc.length - time_series_size];
  for (var _i3 = 0; _i3 < window.price_usd.length; _i3++) {
    price_0[_i3] = (window.price_btc[_i3] / window.price_btc[_i3] - 0 * norm0) / norm0;
    price_1[_i3] = (window.price_usd[_i3] / window.price_btc[_i3] - 0 * norm1) / norm1;
    price_2[_i3] = (window.price_eth[_i3] / window.price_btc[_i3] - 0 * norm2) / norm2;
    price_3[_i3] = (window.price_near[_i3] / window.price_btc[_i3] - 0 * norm3) / norm3;
    price_4[_i3] = (window.price_sol[_i3] / window.price_btc[_i3] - 0 * norm4) / norm4;
  }

  //["NEAR", "BTC", "ETH", "SOL", "USDC"]
  //['MATIC', 'BTC', 'ETH', 'LINK', 'USDC']
  for (var _i4 = 0; _i4 < window.price_usd.length; _i4++) {
    price_all_btc[_i4] = assets_pie_voting[1] * price_0[_i4] + assets_pie_voting[4] * price_1[_i4] + assets_pie_voting[2] * price_2[_i4] + assets_pie_voting[0] * price_3[_i4] + assets_pie_voting[3] * price_4[_i4];
  }
  var price_btc_norm = new Array(time_series_size).fill(0);
  var price_usd_norm = new Array(time_series_size).fill(0);
  var time_norm = new Array(time_series_size).fill(0);
  for (var _i5 = 0; _i5 < time_series_size; _i5++) {
    price_btc_norm[_i5] = price_all_btc[_i5 + (price_all_btc.length - time_series_size)];
    price_usd_norm[_i5] = price_all_usd[_i5 + (price_all_usd.length - time_series_size)];
    time_norm[_i5] = window.time_all[_i5 + (window.time_all.length - time_series_size)];
  }
  var ctx_string = 'voting_0_chart_2';
  var ctx = document.getElementById(ctx_string).getContext('2d');
  var grad_size = 7 * document.getElementById('vote_div_0_2').offsetHeight / 10;
  var gradient1 = ctx.createLinearGradient(0, 0, 0, grad_size);
  gradient1.addColorStop(0, 'rgba(35, 98, 174, 0.9)');
  gradient1.addColorStop(1, 'rgba(35, 98, 174, 0.0)');
  var gradient2 = ctx.createLinearGradient(0, 0, 0, grad_size);
  gradient2.addColorStop(0, 'rgba(200, 37, 26, 0.9)');
  gradient2.addColorStop(1, 'rgba(200, 37, 26, 0.0)');
  var chartStatus = Chart.getChart(ctx_string);
  if (chartStatus != undefined) {
    chartStatus.destroy();
  }
  ;
  var chart2 = new Chart(ctx, {
    type: 'line',
    data: {
      labels: time_norm,
      datasets: [{
        label: 'vs USD',
        data: price_usd_norm,
        fill: true,
        backgroundColor: gradient1,
        tension: 0.1,
        borderWidth: 2,
        borderColor: '#2362ae',
        pointRadius: 0,
        yAxisID: 'y'
      }, {
        label: 'vs BTC',
        data: price_btc_norm,
        fill: true,
        //        backgroundColor: 'rgb(226, 86, 174, 0.3)',
        backgroundColor: gradient2,
        tension: 0.1,
        borderWidth: 2,
        borderColor: '#c8251a',
        pointRadius: 0,
        yAxisID: 'y'
      }]
    },
    options: {
      maintainAspectRatio: true,
      animation: false,
      interaction: {
        intersect: false
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function label(context) {
              var label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += context.parsed.y.toFixed(6);
              }
              return label;
            }
          }
        },
        legend: {
          display: true,
          position: 'top',
          labels: {
            font: {
              size: "11vw"
            },
            color: '#696969'
          },
          align: 'end'
          // title: { display: true, text: "Performace" }
        },

        title: {
          display: false,
          text: 'Simulated Historical Price',
          position: 'top',
          padding: {
            top: 0,
            bottom: 0
          }
        }
      },
      layout: {
        padding: {
          top: 0,
          bottom: 0
        },
        autoPadding: true
      },
      //      scales: { x: { type: 'time', time: { parser: "yyyy-MM-dd" }, grid: { display: false }, ticks: { font: { size: "11vw" } } } },
      scales: {
        x: {
          title: {
            text: "Date",
            display: false,
            font: {
              size: "11vw"
            }
          },
          grid: {
            display: true,
            drawOnChartArea: false
          },
          ticks: {
            font: {
              size: "11vw"
            },
            color: '#696969',
            maxRotation: 0,
            autoSkipPadding: 10,
            callback: function callback(value, index, values) {
              var data1 = window.time_all[value + (window.time_all.length - time_series_size)];
              return String(data1).slice(0, 5);
            }
          }
        },
        y: {
          grace: '5%',
          title: {
            text: "Performance (%)",
            display: false,
            font: {
              size: "11vw"
            }
          },
          grid: {
            display: true,
            drawOnChartArea: true
          },
          ticks: {
            count: 6,
            font: {
              size: "11vw"
            },
            callback: function callback(value, index, values) {
              if (value >= 1000000000 || value <= -1000000000) {
                return value / 1e9 + 'bill';
              } else if (value >= 1000000 || value <= -1000000) {
                return value / 1e6 + 'mill';
              } else if (value >= 1000 || value <= -1000) {
                return value / 1e3 + 'k';
              }
              return (Math.round(value * 10) / 10).toFixed(1);
            },
            color: '#696969'
          }
        },
        y1: {
          grace: '5%',
          title: {
            text: "SER/BTC",
            display: false,
            font: {
              size: "11vw"
            }
          },
          grid: {
            display: true,
            drawOnChartArea: false
          },
          ticks: {
            count: 6,
            font: {
              size: "11vw"
            },
            color: '#696969',
            callback: function callback(value, index, values) {
              if (value >= 1000000000 || value <= -1000000000) {
                return value / 1e9 + 'bill';
              } else if (value >= 1000000 || value <= -1000000) {
                return value / 1e6 + 'mill';
              } else if (value >= 1000 || value <= -1000) {
                return value / 1e3 + 'k';
              }
              return (Math.round(value * 10) / 10).toFixed(1);
            }
          },
          position: 'right'
        }
      }
    }
  });
}
function plot_price_manual(ini) {
  var price_btc_init = [];
  var price_usd_init = [];
  var time_init = [];
  try {
    window.rawFile = new XMLHttpRequest();
    rawFile.open("GET", "https://index.wedefin.com/wedx_price.json" + "?" + String(Math.random()), false);
    rawFile.onreadystatechange = function () {
      if (rawFile.readyState === 4) {
        if (rawFile.status === 200) {
          var allText = JSON.parse(rawFile.responseText);
          for (var i = 0; i < allText['prices'].length; i++) {
            var sdate = new Date(allText['prices'][i][0]);
            time_init.push(String(sdate.getDate()).padStart(2, '0') + "/" + String(sdate.getMonth() + 1).padStart(2, '0') + "/" + String(sdate.getFullYear()).slice(2, 4));
            price_usd_init.push(allText['prices'][i][1]);
            price_btc_init.push(allText['prices'][i][2]);
          }
        }
      }
    };
    rawFile.send(null);
  } catch (_unused2) {}
  ;
  if (time_init.length == 1) {
    time_init.push(time_init[0]);
    price_usd_init.push(price_usd_init[0]);
    price_btc_init.push(price_btc_init[0]);
  }

  // console.log( time_init );
  // console.log( price_usd_init );
  // console.log( price_btc_init );

  if (time_init.length > time_series_size) {
    var price_btc_norm = new Array(time_series_size).fill(0);
    var price_usd_norm = new Array(time_series_size).fill(0);
    var time_norm = new Array(time_series_size).fill(0);
    for (var i = 0; i < time_series_size; i++) {
      price_btc_norm[i] = price_btc_init[i + (price_btc_init.length - time_series_size)];
      price_usd_norm[i] = price_usd_init[i + (price_usd_init.length - time_series_size)];
      time_norm[i] = time_init[i + (time_init.length - time_series_size)];
    }
  } else {
    var price_btc_norm = price_btc_init;
    var price_usd_norm = price_usd_init;
    var time_norm = time_init;
  }
  var ctx_string = 'voting_0_chart_2';
  var ctx = document.getElementById(ctx_string).getContext('2d');
  var grad_size = 7 * document.getElementById('vote_div_0_2').offsetHeight / 10;
  var gradient1 = ctx.createLinearGradient(0, 0, 0, grad_size);
  gradient1.addColorStop(0, 'rgba(35, 98, 174, 0.9)');
  gradient1.addColorStop(1, 'rgba(35, 98, 174, 0.0)');
  var gradient2 = ctx.createLinearGradient(0, 0, 0, grad_size);
  gradient2.addColorStop(0, 'rgba(200, 37, 26, 0.9)');
  gradient2.addColorStop(1, 'rgba(200, 37, 26, 0.0)');
  var min_btc = Math.min.apply(Math, _toConsumableArray(price_btc_norm));
  var max_btc = Math.max.apply(Math, _toConsumableArray(price_btc_norm));
  var min_usd = Math.min.apply(Math, _toConsumableArray(price_usd_norm));
  var max_usd = Math.max.apply(Math, _toConsumableArray(price_usd_norm));
  var tick_count = 6;
  var dec_btc = -Math.floor(Math.log10((max_btc - min_btc) / tick_count));
  var dec_usd = -Math.floor(Math.log10((max_usd - min_usd) / tick_count));
  dec_btc = dec_btc < 0 ? 0 : dec_btc;
  dec_usd = dec_usd < 0 ? 0 : dec_usd;
  var chartStatus = Chart.getChart(ctx_string);
  if (chartStatus != undefined) {
    chartStatus.destroy();
  }
  ;
  var chart2 = new Chart(ctx, {
    type: 'line',
    data: {
      labels: time_norm,
      datasets: [{
        label: 'vs USD',
        data: price_usd_norm,
        fill: true,
        backgroundColor: gradient1,
        tension: 0.1,
        borderWidth: 2,
        borderColor: '#2362ae',
        pointRadius: 0,
        yAxisID: 'y'
      }, {
        label: 'vs BTC',
        data: price_btc_norm,
        fill: true,
        //        backgroundColor: 'rgb(226, 86, 174, 0.3)',
        backgroundColor: gradient2,
        tension: 0.1,
        borderWidth: 2,
        borderColor: '#c8251a',
        pointRadius: 0,
        yAxisID: 'y1'
      }]
    },
    options: {
      maintainAspectRatio: true,
      animation: false,
      interaction: {
        intersect: false
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function label(context) {
              var label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += context.parsed.y.toFixed(6);
              }
              return label;
            }
          }
        },
        legend: {
          display: true,
          position: 'top',
          labels: {
            font: {
              size: "12vw"
            },
            color: '#696969'
          },
          align: 'center',
          onClick: function onClick(e, legendItem, legend) {
            var index = legendItem.datasetIndex;
            var ci = legend.chart;
            if (ci.isDatasetVisible(index)) {
              ci.hide(index);
              legendItem.hidden = true;
              if (index == 0) {
                ci.options.scales.y.ticks.color = 'white';
                ci.options.scales.y.ticks.font.size = '1vw';
                document.getElementById('label_title_usd').style.display = 'none';
              } else {
                ci.options.scales.y1.ticks.color = 'white';
                ci.options.scales.y1.ticks.font.size = '1vw';
                document.getElementById('label_title_btc').style.display = 'none';
              }
            } else {
              ci.show(index);
              if (index == 0) {
                ci.options.scales.y.ticks.color = '#696969';
                ci.options.scales.y.ticks.font.size = '11vw';
                document.getElementById('label_title_usd').style.display = 'inline-flex';
              } else {
                ci.options.scales.y1.ticks.color = '#696969';
                ci.options.scales.y1.ticks.font.size = '11vw';
                document.getElementById('label_title_btc').style.display = 'inline-flex';
              }
              legendItem.hidden = false;
            }
            ci.update();
          }
        },
        title: {
          display: false,
          text: 'Simulated Historical Price',
          position: 'top',
          padding: {
            top: 0,
            bottom: 0
          }
        }
      },
      layout: {
        padding: {
          top: 0,
          bottom: 0
        },
        autoPadding: true
      },
      //      scales: { x: { type: 'time', time: { parser: "yyyy-MM-dd" }, grid: { display: false }, ticks: { font: { size: "11vw" } } } },
      scales: {
        x: {
          title: {
            text: "Date",
            display: false,
            font: {
              size: "11vw"
            }
          },
          grid: {
            display: true,
            drawOnChartArea: false
          },
          ticks: {
            font: {
              size: "12vw"
            },
            color: '#696969',
            maxRotation: 0,
            autoSkipPadding: 10,
            callback: function callback(value, index, values) {
              var data1 = time_norm[value];
              return String(data1).slice(0, 5);
            }
          }
        },
        y: {
          grace: '5%',
          title: {
            text: "Price (USD)",
            display: false,
            font: {
              size: "11vw"
            }
          },
          grid: {
            display: true,
            drawOnChartArea: true
          },
          ticks: {
            count: tick_count,
            font: {
              size: "12vw"
            },
            callback: function callback(value, index, values) {
              if (value >= 1000000000 || value <= -1000000000) {
                return value / 1e9 + 'bill';
              } else if (value >= 1000000 || value <= -1000000) {
                return value / 1e6 + 'mill';
              } else if (value >= 1000 || value <= -1000) {
                return value / 1e3 + 'k';
              }
              return (Math.round(value * 1000) / 1000).toFixed(dec_usd);
            },
            color: '#696969'
          }
        },
        y1: {
          grace: '5%',
          title: {
            text: "Price (BTC)",
            display: false,
            font: {
              size: "11vw"
            }
          },
          grid: {
            display: true,
            drawOnChartArea: false
          },
          ticks: {
            count: tick_count,
            font: {
              size: "12vw"
            },
            color: '#696969',
            callback: function callback(value, index, values) {
              if (value >= 1000000000 || value <= -1000000000) {
                return value / 1e9 + 'bill';
              } else if (value >= 1000000 || value <= -1000000) {
                return value / 1e6 + 'mill';
              } else if (value >= 1000 || value <= -1000) {
                return value / 1e3 + 'k';
              }
              return (Math.round(value * 100000000) / 100000000).toFixed(dec_btc);
            }
          },
          position: 'right'
        }
      }
    }
  });
}

// for (let i = 0; i < 4; i++) {

//   document.getElementById('vote_' + String(i)).onclick = async function () {

//     let distro_send = null;
//     if (i == 0) {

//       distro_send = [Math.round(distro_raw_0[0]), Math.round(distro_raw_0[1]), Math.round(distro_raw_0[2]), Math.round(distro_raw_0[3]), Math.round(distro_raw_0[4])];

//     } else {

//       let distro_raw = [];
//       let rawFile = new XMLHttpRequest();
//       rawFile.open("GET", "https://pro.wedefin.com/distro_" + String(i - 1) + ".json", false);
//       rawFile.onreadystatechange = function () {
//         if (rawFile.readyState === 4) {
//           if (rawFile.status === 200) {
//             var allText = JSON.parse(rawFile.responseText);
//             for (let j = 0; j < allText['distro'].length - 1; j++) {
//               distro_raw.push(allText['distro'][j]);
//             }
//           }
//         }
//       }
//       rawFile.send(null);

//       distro_send = [distro_raw[2], distro_raw[0], distro_raw[1], distro_raw[3], distro_raw[4]];

//     }

//     let sum1 = 0;
//     for (let j = 0; j < distro_send.length; j++) {
//       sum1 += distro_send[j];
//     }
//     distro_send[0] += 1000 - sum1;

//     document.getElementById("blocker").style.display = 'block';
//     try {
//       let a = await contract.voting({ "prop_distro": distro_send }, "300000000000000", "1");
//     } catch (error) {
//       alert(error);
//     }
//     try {
//       let b = await contract.update_weights({}, "300000000000000");
//     } catch (error) {
//       alert(error);
//     }
//     try {
//       let c = await contract.rebalance_portfolio({}, "300000000000000");
//     } catch (error) {
//       alert(error);
//     }
//     location.reload();

//   }
// }

// document.getElementById('vote_apply').onclick = function () {

//   plot_data_manual_consensus();
//   try {

//     let x = 0;
//     for (let i = 0; i < distro_average.length; i++) {
//       x += Math.round(distro_average[i] * 1000);
//       if (i < distro_average.length - 1) {
//         start_distro[i] = x / 10;
//       }
//     }

//     document.getElementById('slider').noUiSlider.set(start_distro);

//   } catch (error) {
//   }

// }

// document.getElementById('allocation-select').onchange = function () {
//     let x = 0;
//     let start_distro = [];
//     for (let i = 0; i < window.distro_user.length; i++) {
//       x += Math.round(window.distro_user[i] * 1000);
//       if (i < window.distro_user.length - 1) {
//         start_distro.push( x / 10 );
//       }
//     }

// }

var submit = document.querySelectorAll(".button_small");
submit.forEach(function (btn) {
  btn.addEventListener("click", timeframe);
});
function timeframe() {
  var submit = document.querySelectorAll(".button_small");
  submit.forEach(function (btn) {
    btn.style.backgroundColor = "white";
    btn.style.color = "#8b949b";
  });
  this.style.backgroundColor = "#8b949b";
  this.style.color = "white";
  if (this.value === "1Y") {
    time_series_size = 365;
  } else if (this.value === "1Q") {
    time_series_size = 120;
  } else if (this.value === "1M") {
    time_series_size = 30;
  } else if (this.value === "1W") {
    time_series_size = 7;
  }
  plot_price_manual(1);
}
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "63105" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","voting.js"], null)
//# sourceMappingURL=/voting.0eb810d3.js.map