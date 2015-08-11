/**
 * (c) Copyright 2012 SAP AG. All rights reserved
 *
 * Summary: Provides Radar Chart in Credit Management System.
 *
 * Dependency files: N/A
 *
 */
/*
 * Example
 *
   var radar = new RadarChart({
        containerId: 'myContainer',
        width: 500,
        height: 500,
        nameColor: '#000',
        lineColor: '#FFC125',
        //lineCap: 'round',
        lineWidth: 4,
        backLineColor: '#666',
        backLineWidth: 1,
        valueArr:[
          {
            label:'订单金额变化率',
            disable:false,
            value:0.3,
            params:[0.2,0.5,0.7,1]
          },
          {
            label:'持续无订单时间',
            disable:false,
            value:20,
            params:[20,60,70,100]
          },
          {
            label:'逾期欠款金额',
            disable:false,
            value:3000,
            params:[100000,500000,700000,900000]
          },
          {
            label:'逾期欠款时间',
            disable:false,
            value:50,
            params:[20,60,80,100]
          },
          {
            label:'客户违约概率',
            disable:false,
            value:0.3,
            params:[0.1,0.3,0.7,1]
          }
        ]
});
 */
var RadarChart = ( function(document, Math) {
  var Point = function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }, 
  degreesToRadians = function(degrees) {
    return degrees * Math.PI / 180;
  }, 
  rotatePoint = function(fromPoint, centerPoint, radians, clockwise) {
    if( typeof clockwise == 'undefined')
      clockwise = true;
    var p = new Point;
    var x1 = fromPoint.x - centerPoint.x;
    var y1 = fromPoint.y - centerPoint.y;
    if(clockwise) {
      p.x = Math.cos(radians) * x1 - Math.sin(radians) * y1;
      p.y = Math.cos(radians) * y1 + Math.sin(radians) * x1;
    } else {
      p.x = Math.cos(radians) * x1 + Math.sin(radians) * y1;
      p.y = Math.cos(radians) * y1 - Math.sin(radians) * x1;
    }
    p.x += centerPoint.x;
    p.y += centerPoint.y;
    return p;
  }, 
  Const;
  Const = function(config) {
    this._cfg = config;
  };
  Const.prototype = {
    render : function() {
      this._$ctn = document.getElementById(this._cfg.containerId);
      this._$inn = document.createElement('div');
      // this._$inn.style.position = 'relative';
      this._$ctn.appendChild(this._$inn);
      this._$inn.style.width = this._cfg.width + 'px';
      this._$inn.style.height = this._cfg.height + 'px';
      this._$inn.style.margin = 'auto';
      this._$cvs = document.createElement('canvas');
      this._$cvs.id = this._cfg.containerId + '_cvs';
      // this._$cvs.style.position = 'absolute';
      this._$cvs.style.zIndex = 0;
      this._$inn.appendChild(this._$cvs);
      this._$cvs.width = this._cfg.width;
      this._$cvs.height = this._cfg.height;
      this._$ctx = this._$cvs.getContext('2d');
      this._c = new Point(.5 * this._cfg.width, .5 * this._cfg.height);//center
      if( typeof this._cfg.radius === 'undefined') {
        this._r = Math.round(0.7 * 0.5 * this._cfg.width);//TODO::can English shown fully?
      } else {
        this._r = this._cfg.radius;
      }
      this.maxTextWidth = Math.round(.5 * this._cfg.width) - this._r;
      this._n = this._cfg.valueArr.length;
      this._a = 360 / this._n;
      this._referCount = this._cfg.valueArr[0].params.length;
      this._pArr = [];//peak
      this._referArr = [];//refer line
      this._vArr = [];//value
      var obj;

      //Draw refer line cirle by cirle, from inner to outer
      for(var i = 0; i < this._referCount; i++) {//each circle
        var eachReferCircle = [];
        for(var j = 0; j < this._n; j++) {//each backbone
          var obj = this._cfg.valueArr[j];
          var referValue = obj.params[i];
          var maxReferValue = obj.params[this._referCount - 1];
          var newY = this._c.y - (referValue / maxReferValue) * this._r;
          var p1 = new Point(this._c.x, newY);
          //retate point from the Y-axis
          eachReferCircle[j] = rotatePoint(p1, this._c, degreesToRadians(this._a) * j);
        }
        this._drawDashedLine(this._$ctx, eachReferCircle);//TODO use different style
        //get outer one
        this._pArr = eachReferCircle;
      }

      //Draw backbone
      for(var i = 0; i < this._n; i++) {
        var to = i < this._n - 1 ? i + 1 : 0;
        this._drawBackboneLine(this._$ctx, this._pArr[i], this._c);
        this._drawName(this._$ctx, this._pArr[i], i);
      }

      //draw value line
      for( i = 0; i < this._n; i++) {
        var obj = this._cfg.valueArr[i];
        if(!obj.disable) {
          var p1 = new Point(this._c.x, this._c.y - (obj.value / obj.params[this._referCount - 1]) * this._r);
          //retate point from the Y-axis
          this._vArr[i] = rotatePoint(p1, this._c, degreesToRadians(this._a) * i);
        } else {
          this._vArr[i] = null;
        }
      }
      this._drawLine(this._$ctx, this._vArr);
    },
    _drawDashedLine : function(ctx, arr, dashArray) {
      var from = arr[0];
      for(var i = 0; i < this._n; i++) {
        var to = i < this._n - 1 ? arr[i + 1] : arr[0];
        this._dashedLine(ctx, from, to);
        from = to;
      }
    },
    _dashedLine : function(ctx, p1, p2, dashArray) {
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
      // ctx.lineTo(x2,y2);
      ctx.strokeStyle = this._cfg.backLineColor;
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
    _drawLine : function(ctx, arr) {
      ctx.beginPath();
      var from = arr[0];
      for(var i = 0; i < this._n; i++) {
        var to = i < this._n - 1 ? arr[i + 1] : arr[0];
        if(to) {
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          from = to;
        }
      }
      ctx.strokeStyle = this._cfg.lineColor;
      ctx.lineCap = this._cfg.lineCap;
      ctx.lineWidth = this._cfg.lineWidth;
      ctx.stroke();
      ctx.closePath();
    },
    _drawName : function(ctx, p, i) {
      ctx.beginPath();
      ctx.font = '8px/2 Unknown Font, sans-serif';

      var txt = this._cfg.valueArr[i].label || '';
      var disX = 10;
      var disY = 5;
      var mis = 2;
      var w = this._$ctx.measureText(txt).width;
      var p1 = new Point(p.x, p.y);

      var dx = p1.x - this._c.x;
      if(dx >= -mis && dx <= mis) {
        p1.x -= .5 * w;
      } else if(dx > mis) {
        p1.x += disX;
      } else if(dx < mis) {
        p1.x -= w + disX;
      }
      
      //Fix the position of the label
      if(dx > 0 && this._cfg.width - p1.x < w) {
        p1.x = this._cfg.width - w;
      } else if(dx < 0 && p1.x < w) {
        p1.x = disX;
      }

      var dy = p1.y - this._c.y;
      if(dy >= -mis && dy <= mis) {
        ctx.textBaseline = 'middle';
        if(window.G_vmlCanvasManager) {
          p1.y += 12;
        }
      } else if(dy > mis) {
        ctx.textBaseline = 'top';
        p1.y += disY;
        if(window.G_vmlCanvasManager) {
          p1.y += 24;
        }
      } else if(dy < mis) {
        ctx.textBaseline = 'bottom';
        p1.y -= disY;
      }

      ctx.fillStyle = this._cfg.nameColor;
      ctx.fillText(txt, p1.x, p1.y);
      ctx.closePath();
    }
  };

  return Const;
}(document, Math));
