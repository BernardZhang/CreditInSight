/**
 * (c) Copyright 2012 SAP AG. All rights reserved
 *
 * Summary: Provides Radar Chart in Credit Management System.
 *
 * Dependency files: N/A
 *
 */
/*
  var radar = new LineChart({
      containerId: 'myContainer',
      width: 300,
      height: 300,
      nameColor: '#000',
      lineColor: '#436EEE',
      lineWidth: 4,
      backLineColor: '#666',
      backLineWidth: 1,
      warningLineColor: ['#FFC125','#CD5555','#EE0000'],
      value:{
          label:'订单金额变化率',
          disable:false,
          value:0.3,
          history:[
                   
                   {date:'2012-04-05',value:0.2}
                  ],
          params:[0.2,0.5,0.7,1]
        }
  });
 */
var LineChart = ( function(document, Math) {
  var Point = function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }, i = 0, j = 0, Const;
  Const = function(config) {
    this._cfg = config;
  };
  Const.prototype = {
    render : function() {
      this._$ctn = document.getElementById(this._cfg.containerId);
      this._$inn = document.createElement('div');
      this._$inn.style.position = 'relative';
      this._$ctn.appendChild(this._$inn);
      this._$inn.style.width = this._cfg.width + 'px';
      this._$inn.style.height = this._cfg.height + 'px';
      this._$inn.style.margin = 'auto';
      this._$cvs = document.createElement('canvas');
      this._$cvs.id = this._cfg.containerId + '_cvs';
      this._$cvs.style.position = 'absolute';
      this._$cvs.style.zIndex = 0;
      this._$inn.appendChild(this._$cvs);
      this._$cvs.width = this._cfg.width;
      this._$cvs.height = this._cfg.height;
      this._$ctx = this._$cvs.getContext('2d');
      this._padding = this._cfg.padding || this._cfg.height * 0.05;
      //padding space of top, bottom, left
      this._width = this._$cvs.width - 2 * this._padding;
      this._height = this._$cvs.height - 3 * this._padding;
      this._backlineCount = this._cfg.refer || 5;
      this._valueArr = this._cfg.value.history;
      this._warningArr = this._cfg.value.params;
      this._maxReferValue = this._warningArr[this._warningArr.length - 1];

      //Draw base line
      var ltp = new Point(this._padding * 2, this._padding), rtp = new Point(this._$cvs.width, this._padding), lbp = new Point(this._padding * 2, this._$cvs.height - this._padding), rbp = new Point(this._$cvs.width, this._$cvs.height - this._padding), p1 = ltp, p2 = rtp, yAixsTextPoint = new Point(this._padding * 2 - 5, this._padding * 0.5);
      var postFix = "";
      var multiple = 1;
      var referValueDiff = this._maxReferValue / this._backlineCount;
      var label;
      if(1 === this._maxReferValue) {
        multiple = 100;
        postFix = '%';
      }

      //Draw backline
      for( i = this._backlineCount; i >= 0; i--) {
        p1.y = this._getYAxisValue(i * referValueDiff);
        p2.y = p1.y;
        yAixsTextPoint.y = p1.y;
        label = Math.round(this._maxReferValue * multiple * i / this._backlineCount) + postFix;
        this._drawBackboneLine(this._$ctx, p1, p2);
        this._drawName(this._$ctx, yAixsTextPoint, label);
      }
      //Draw warning line
      for( i = 0; i < this._warningArr.length - 1; i++) {
        p1.y = this._getYAxisValue(this._warningArr[i]);
        p2.y = p1.y;
        this._dashedLine(this._$ctx, p1, p2, this._cfg.warningLineColor[i]);
      }

      //find min/max/middle value and display their label
      p1.y = lbp.y;
      if(2 < this._valueArr.length) {
        //left
        p1.x = lbp.x + this._padding * 3;
        this._drawName(this._$ctx, p1, this._valueArr[0].date);
        //right
        p1.x = rbp.x - this._padding;
        this._drawName(this._$ctx, p1, this._valueArr[this._valueArr.length - 1].date);
        //center
        p1.x = (rbp.x) / 2 + lbp.x;
        this._drawName(this._$ctx, p1, this._valueArr[Math.round(this._valueArr.length - 1)/2].date);
      } else if(2 === this._valueArr.length) {
        //left
        p1.x = lbp.x + this._padding * 3;
        this._drawName(this._$ctx, p1, this._valueArr[0].date);
        //right
        p1.x = rbp.x - this._padding;
        this._drawName(this._$ctx, p1, this._valueArr[this._valueArr.length - 1].date);
      } else if(1 === this._valueArr.length) {
        //center
        p1.x = (rbp.x) / 2 + lbp.x;
        this._drawName(this._$ctx, p1, this._valueArr[Math.round(this._valueArr.length - 1)].date);
      }

      //Draw line
      for( i = 0; i < this._valueArr.length; i++) {
        p2.x = this._getXAxisValue(i);
        p2.y = this._getYAxisValue(this._valueArr[i].value);
        if(i > 0) {
          this._drawLine(this._$ctx, p1, p2);
        }
        p1.x = p2.x;
        p1.y = p2.y;
      }
      if(1 === this._valueArr.length) {
        p2.x += 3;
        this._drawLine(this._$ctx, p1, p2);
      }
    },
    _dashedLine : function(ctx, p1, p2, colorCode, dashArray) {
      if(!dashArray)
        dashArray = [10, 5];
      if(dashLength == 0)
        dashLength = 0.001;
      // Hack for Safari
      var dashCount = dashArray.length;
      var x = p1.x, y = p1.y, x2 = p2.x, y2 = p2.y;
      var dx = (x2 - x), dy = (y2 - y);
      var slope = dy / dx;
      var distRemaining = Math.sqrt(dx * dx + dy * dy);
      var dashIndex = 0, draw = true;
      ctx.beginPath();
      ctx.moveTo(x, y);
      while(distRemaining >= 0.1) {
        var dashLength = dashArray[dashIndex++ % dashCount];
        if(dashLength > distRemaining)
          dashLength = distRemaining;
        var xStep = Math.sqrt(dashLength * dashLength / (1 + slope * slope));
        if(dx < 0)
          xStep = -xStep;
        x += xStep
        y += slope * xStep;
        ctx[draw ? 'lineTo' : 'moveTo'](x, y);
        distRemaining -= dashLength;
        draw = !draw;
      }
      if( typeof colorCode === 'undefined') {
        colorCode = '#000';
      }
      ctx.strokeStyle = colorCode;
      ctx.lineCap = this._cfg.lineCap;
      ctx.lineWidth = this._cfg.backLineWidth;
      ctx.stroke();
      ctx.closePath();
    },
    _drawBackboneLine : function(ctx, p1, p2) {
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = this._cfg.backLineColor;
      ctx.lineCap = this._cfg.lineCap;
      ctx.lineWidth = this._cfg.backLineWidth;
      ctx.stroke();
      ctx.closePath();
    },
    _drawLine : function(ctx, from, to) {
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.strokeStyle = this._cfg.lineColor;
      ctx.lineCap = this._cfg.lineCap;
      ctx.lineWidth = this._cfg.lineWidth;
      ctx.stroke();
      ctx.closePath();
      this._drawVertex(ctx, to);
    },
    _getXAxisValue : function(value) {
      var x = (value + 0.5) * (this._width / this._valueArr.length) + this._padding * 2;
      return Math.round(x);
    },
    _getYAxisValue : function(value) {
      var y = (1 - value / this._maxReferValue) * this._height + this._padding;
      return Math.round(y);
    },
    _drawVertex : function(ctx, p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, this._cfg.lineWidth / 2, 0, 2 * Math.PI);
      ctx.fillStyle = this._cfg.lineColor;
      ctx.fill();
      ctx.closePath();
    },
    _drawName : function(ctx, p, label) {
      ctx.beginPath();
      ctx.font = '12px/2 Unknown Font, sans-serif';
      ctx.textAlign = "right";
      ctx.textBaseline = 'middle';
      ctx.fillStyle = this._cfg.nameColor;
      ctx.fillText(label, p.x, p.y);
      ctx.closePath();
    }
  };

  return Const;
}(document, Math));
