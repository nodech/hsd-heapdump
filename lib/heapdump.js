/*!
 * heapdump.js - Dump v8 heap for hsd.
 * Copyright (c) 2022, Nodari Chkuaselidze (MIT License)
 */

'use strict';

const path = require('path');
const v8 = require('v8');
const Validator = require('bval');

class Plugin {
  constructor(node) {
    this.node = node;
    this.config = node.config;
    this.logger = node.logger.context('heapdump');
    this.network = node.network;
    this.heapdumpDir = node.config.str('heapdump-dir', node.config.prefix);

    this.isNode = node.chain ? true : false;
    this.isWalletNode = node.wdb ? true : false;
    this.handleHeapDump = this._handleHeapDump.bind(this);

    this.nodeHTTP = null;
    this.walletHTTP = null;

    // this.dumping = false;
  }

  init() {
    if (this.isWalletNode) {
      this.walletHTTP = this.node.http;
      return;
    }

    this.nodeHTTP = this.node.http;

    if (this.node.get('walletdb')) {
      const wplugin = this.node.get('walletdb');
      this.walletHTTP = wplugin.http;
    }
  }

  async open() {
    // We do this in the open, to make sure wdb was already set up.
    this.init();
    this.initNodeRoutes();
    this.initWalletRoutes();
  }

  initNodeRoutes() {
    if (!this.nodeHTTP)
      return;

    this.nodeHTTP.post('/heapdump', this.handleHeapDump);
  }

  initWalletRoutes() {
    if (!this.walletHTTP)
      return;

    this.walletHTTP.post('/heapdump', this.handleHeapDump);
  }

  async _handleHeapDump(req, res) {
    // This does not matter, as the v8 heap dump is blocking process.
    // if (this.dumping) {
    //   res.json(429, {
    //     error: {
    //       message: 'Dumping is in progress.'
    //     }
    //   });
    //   return;
    // }

    // this.dumping = true;
    const valid = Validator.fromRequest(req);
    const exposeInternals = valid.bool('internals', false);
    const exposeNumericaValues = valid.bool('numeric', false);

    const filename = `${Date.now()}.heapsnapshot`;
    const filepath = path.join(this.heapdumpDir, filename);

    this.logger.info(`Dumping heap to ${filepath}.`);
    v8.writeHeapSnapshot(filepath, {
      exposeInternals,
      exposeNumericaValues
    });

    this.logger.info(`Dumped heap to ${filepath}.`);
    res.json(200, {
      success: true
    });

    // this.dumping = false;
    return;
  }

  async close() {
  }

  static init(node) {
    return new Plugin(node);
  }
}

Plugin.id = 'hsd-heapdump';

module.exports = Plugin;
