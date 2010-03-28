// A factory class for to make using the Ti api a little easier

// Ideally one should never us Ti.UI.<method> directly, but always use
// factory.<method>, this means later updates / changes all happen
// in one location - but this is not always practicle


// factory needs tu to be defined from lib/util.js (handled by loader.js)
// var tu = new TuUtil();


function TUFactory() {

    // some default colors, you may overwrite with your own
    // if you use this as a parent class
    this.colors = function() {
        
        return {
            text_selected: '#FF0000',
            text_unselected: '#CCCCCC',
            text_default: '#385487'
        };
    };

    this.fontFamily = function() {
        return 'Arial';
    };

    this.total_height = function() {
        // this includes the tab bar
        return 460;
    };

    this.total_width = function() {
        return 320;
    };

    this.default_width = function() {
        return 300;
    };

    this.default_left = function() {
        return 10;
    };

    this.vmiddle = function() {
        return this.height / 2;
    };

    // Ti
    this.currentWindow = function() {
        return Ti.UI.currentWindow;
    };

    this.createView = function(conf) {
        var top = conf.top || 0;

        var height = this.total_height() - top;

        var base_conf = {
            top: top,
            height: height,
            backgroundColor: '#FFFFFF'
        };
        tu.extend(true, base_conf, conf);

        var resultView = Ti.UI.createView(base_conf);

        return resultView;
    };

    this.createWindow = function(conf) {
        var base_conf = {
            backgroundColor: '#FFFFFF'
        };
        tu.extend(true, base_conf, conf);

        var window = Ti.UI.createWindow(base_conf);

        return window;
    };

    this.createScrollView = function(conf) {
        var top = conf.top || 0;

        var base_conf = {
            top: top
            //        	height:200,
            //        	width:75
            // borderRadius:10,
            // contentWidth:75,
            // contentHeight:500,
            // backgroundColor:'#13386c'
        };
        tu.extend(true, base_conf, conf);

        var scrollView = Ti.UI.createScrollView(base_conf);

        return scrollView;
    };

    this.createTableView = function(conf) {
        var top = conf.top || 0;

        var height = this.total_height() - top;

        var base_conf = {
            top: top
            //        	height:200,
            //        	width:75
            //        	backgroundColor:'transparent',
            //        	data:data,
            //        	separatorStyle:Ti.UI.iPhone.TableViewSeparatorStyle.NONE,
        };
        tu.extend(true, base_conf, conf);
        var tableView = Titanium.UI.createTableView(base_conf);
        return tableView;
    };

    // LABLEs
    this.createLabel = function(conf) {
        var height = conf.height || 30;

        var base_conf = {
            text: '',
            width: this.default_width(),
            height: height,
            font: {
                fontFamily: this.fontFamily(),
                fontSize: 16,
                fontWeight: 'bold'
            },
            left: this.default_left()
        };
        // merge in
        tu.extend(true, base_conf, conf);

        var label = Ti.UI.createLabel(base_conf);
        return label;
    };
    this.addLabel = function(conf) {
        // create a label
        var label = this.createLabel(conf);
        conf.win.add(label);
        return label;
    };

    this.createField = function(conf) {
        var height = conf.height || 35;

        var base_conf = {
            height: height,
            left: this.default_left(),
            width: this.default_width(),
            borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
            keyboardType: conf.keyboardType || Ti.UI.KEYBOARD_NUMBERS_PUNCTUATION
        };
        tu.extend(true, base_conf, conf);

        var field = Ti.UI.createTextField(base_conf);
        return field;
    };

    // BUTTONs
    this.createButtonBar = function(conf) {
        var height = conf.height || 40;
        var base_conf = {
            height: height,
            width: this.default_width()
        };
        tu.extend(true, base_conf, conf);

        var buttonBar = Ti.UI.createButtonBar(base_conf);
        return buttonBar;
    };

    this.createButton = function(conf) {
        var height = conf.height || 30;
        var base_conf = {
            title: '',
            height: height,
            width: this.default_width() // Full window width
        };
        tu.extend(true, base_conf, conf);

        var button = Ti.UI.createButton(base_conf);
        return button;
    };
    this.addButton = function(conf) {
        var button = this.createButton(conf);
        conf.win.add(button);
        return button;
    };

    this.createImageView = function(conf) {
        var base_conf = {};
        tu.extend(true, base_conf, conf);

        var img = Ti.UI.createImageView(base_conf);
        return img;

    };

    this.createToolbar = function(conf) {

        var base_conf = {
            //        	items:[flexSpace, camera, send],
            // borderTop:true,
            // borderBottom:false,
            // translucent:true,
            // barColor:'#999',
            // backgroundColor:'#336699'
            //        	style:Titanium.UI.iPhone.SystemButtonStyle.BAR
        };
        tu.extend(true, base_conf, conf);

        var toolbar = Titanium.UI.createToolbar(base_conf);
        return toolbar;

    };

    // Helper functions
    this.flexSpace = function() {
        return Ti.UI.createButton({
            systemButton: Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
        });
    };

    this.mapToolBar = function() {

        // Switch styles
        var flexSpace = this.flexSpace();

        // button to change map type to SAT
        var sat = Titanium.UI.createButton({
            title: 'Sat',
            style: Titanium.UI.iPhone.SystemButtonStyle.BORDERED
        });
        sat.addEventListener('click', function() {
            // set map type to satellite
            mapview.setMapType(Titanium.Map.SATELLITE_TYPE);
        });

        // button to change map type to STD
        var std = Titanium.UI.createButton({
            title: 'Std',
            style: Titanium.UI.iPhone.SystemButtonStyle.BORDERED
        });
        std.addEventListener('click', function() {
            // set map type to standard
            mapview.setMapType(Titanium.Map.STANDARD_TYPE);
        });

        // button to change map type to HYBRID
        var hyb = Titanium.UI.createButton({
            title: 'Hyb',
            style: Titanium.UI.iPhone.SystemButtonStyle.BORDERED
        });
        hyb.addEventListener('click', function() {
            // set map type to hybrid
            mapview.setMapType(Titanium.Map.HYBRID_TYPE);
        });

        // button to zoom-in
        var zoomin = Titanium.UI.createButton({
            title: '+',
            style: Titanium.UI.iPhone.SystemButtonStyle.BORDERED
        });
        zoomin.addEventListener('click', function() {
            mapview.zoom(1);
        });

        // button to zoom-out
        var zoomout = Titanium.UI.createButton({
            title: '-',
            style: Titanium.UI.iPhone.SystemButtonStyle.BORDERED
        });
        zoomout.addEventListener('click', function() {
            mapview.zoom(-1);
        });

        return[std, flexSpace, hyb, flexSpace, sat, flexSpace, zoomin, flexSpace, zoomout];

    };

    this.show_msg = function(msg) {

        var a = Ti.UI.createAlertDialog();
        a.setMessage(msg);
        a.show();
    };

}