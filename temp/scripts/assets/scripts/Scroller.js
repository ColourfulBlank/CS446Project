"use strict";
cc._RFpush(module, '930d5LshrZBkbsK0b05li7R', 'Scroller');
// scripts/Scroller.js

/*
	Scroll background and reset at certain point, so that it looks like an infinate looping backgroun
*/

var Scroller = cc.Class({
	"extends": cc.Component,
	properties: {
		speed: 0, //speed of scrolling
		resetX: 0 },

	//reset point
	update: function update(dt) {
		this.node.x += this.speed * dt;
		if (this.node.x <= this.resetX) {
			this.node.x -= this.resetX;
		}
	}
});

cc._RFpop();