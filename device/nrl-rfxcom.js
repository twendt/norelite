/*jslint node: true */
module.exports = function (RED) {
    "use strict";
    var common = require('../lib/common');


    /*
        Defines the output node for a rule. Copied to a large extent from 66-mongodb.js
    */
    function NoreliteRfxcomOutNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.code = config.code;
        node.dimmable = config.dimmable;

        common.setStatus(node);

        /* When a message is received */
        node.on("input", function (msg) {
            //Validate input
            var validate = common.validatePayload(msg.payload);
            if (!validate.valid) {
                node.warn(validate.error);
                return;
            }

            var nmsg = {};
            nmsg.topic = node.code;

            var val;
            if (node.dimmable) {
                if (msg.payload.status === 1 && msg.payload.value > 0) {
                    val = "level " + (msg.payload.value / 100);
                    common.setStatus(node, 1, "Dim " + msg.payload.value + "%");
                } else {
                    val = "Off";
                    common.setStatus(node, -1, "Off");
                }

            } else {
                if (msg.payload.status === 1 && msg.payload.value > 0) {
                    val = "On";
                    common.setStatus(node, 1, "On");
                } else {
                    val = "Off";
                    common.setStatus(node, -1, "Off");
                }
            }
            nmsg.payload = val;

            //Also passing the original instruction if
            nmsg.instruction = msg.payload;
            nmsg.instruction.lid = node.id;

            node.send(nmsg);
        });

    }
    RED.nodes.registerType("nrl-rfxcom-out", NoreliteRfxcomOutNode);
};
