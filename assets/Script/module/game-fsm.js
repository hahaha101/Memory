var State = require('state.com');

var instance;
var model;
var playing;

function on (message) {
    return function (msgToEvaluate) {
        return msgToEvaluate === message;
    };
}

var evaluating = false;

exports = {
    init: function (target) {
        // send log messages, warnings and errors to the console
        State.console = console;

        model = new State.StateMachine("root");
        var initial = new State.PseudoState("init-root", model, State.PseudoStateKind.Initial);

        var show = new State.State("展示图片",model);
        var playing = new State.State("玩家决定",model);
        var judge = new State.State("判断对错",model);

        initial.to(show);
        show.to(playing).when(on("done"));
        playing.to(judge).when(on("end"));
        judge.to(show).when(on("right"));

        show.entry(function () {
            target.onBetState(true);
        });
        show.exit(function () {
            target.onBetState(false);
        });

        judge.entry(function () {
            target.onEndState(true);
        });
        judge.exit(function () {
            target.onEndState(false);
        });

        // 开局后的子状态

        var initialP = new State.PseudoState("init 已开局", playing, State.PseudoStateKind.Initial);
        var deal = new State.State("发牌", playing);
        var playersTurn = new State.State("玩家决策", playing);

        initialP.to(deal);
        deal.to(playersTurn).when(on("dealed"));

        deal.entry(function () {
            target.onEnterDealState();
        });
        playersTurn.entry(function () {
            target.onPlayersTurnState(true);
        });
        playersTurn.exit(function () {
            target.onPlayersTurnState(false);
        });
        // create a State machine instance
        instance = new State.StateMachineInstance("fsm");
        State.initialise(model, instance);
    },

    toDone: function () {
        this._evaluate('done');
    },
    toRight: function () {
        this._evaluate('right');
    },
    onDealed: function () {
        this._evaluate('dealed');
    },
    onPlayerActed: function () {
        this._evaluate('end');
    },

    _evaluate: function (message) {
        if (evaluating) {
            // can not call fsm's evaluate recursively
            setTimeout(function () {
                State.evaluate(model, instance, message);
            }, 1);
            return;
        }
        evaluating = true;
        State.evaluate(model, instance, message);
        evaluating = false;
    },

    _getInstance: function () {
        return instance;
    },

    _getModel: function () {
        return model;
    }
};

module.exports = exports;
