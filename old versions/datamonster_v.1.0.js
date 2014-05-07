var _version = 'v.1.0';
var _DM_Data = new Object();
var _storeInfo = new Object();
var _estimatedBps = new Object(); // count, last byte count, eBPS
var _estimatedBpsGlobal = new Object(); // count, last byte count, eBPS
var _DM_Config_Open = false;
var _DM_Tooltip_Last = '';
var _DM_Tooltip_Toggle = false;
var _DM_Color_Items_Toggle = false;
var sts_type = new Array(
	[' bytes', ' KB', ' MB', ' GB', ' TB', ' PB']
);

Load_Data_Monster();

function Load_Data_Monster(){
	$("head").append("<style id='datamonster_style'></style>");
	$("#datamonster_style").text(''
		+ '#DM_Bar { font-size:12px; position:fixed; z-index:999; bottom:0px; width:100%; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black !important; color:white; cursor:default; display:none; line-height:normal; padding-bottom:2px; }'
		+ '#DM_Bar table th, #DM_Personal_Averages table th { text-align:center; }'
		+ '#DM_Config { cursor:pointer; color:#71accb; }'
		+ '#DM_Config:hover, .active #DM_Config { color:#c1e7fa; }'
		+ '#DM_Config_Panel { z-index:999; position:absolute; top:50px; left:0px; right:0px; height:0px; background-color:#080808; box-sizing: border-box; border-bottom:1px solid #101010; overflow:hidden; }'
		+ '#DM_Config_Display { color:white; display:none; cursor:default; } '
		+ '#DM_eBPS { position:absolute; bottom:0px; left:0px;}'
		+ '.DM_Config_Item { line-height:22px; padding:6px; }'
		+ '.DM_Config_Item input[type=checkbox] { position:relative; top:2px; }'
		+ '.DM_Config_Item label { margin:0px; }'
		+ '#DM_Personal_Averages { display:none; cursor:default; }'
		+ '#DM_Personal_Averages table th { border-bottom:1px solid #666666; }'
		+ '#pops { z-index:997; }'
		+ '#upgrades { overflow:visible; }'
		+ '#powerupstore { background-color:white; }'
		+ '#tooltipAnchor { z-index:998; } '
		+ '.tooltip { z-index:998; pointer-events:none; cursor:default; }'
		+ '.tooltip-inner { max-width:250px; width:250px; }'
		+ '.DM_Tooltip { font-size:12px; position:relative; height:100%; width:100%; }'
		+ '.DM_Tooltip_Header { font-weight:bold; text-align:left; border-bottom:1px solid #666666; padding:2px; width:100%; color:#4bb8f0; }'
		+ '.DM_Tooltip_Count { font-weight:bold; padding:2px; color:#ffffff; position:absolute; top:0px; right:0px; }'
		+ '.DM_Tooltip_Description { text-align:left; padding:4px; width:100%; color:#dfdfdf; }'
		+ '.DM_Tooltip_Footer { font-weight:bold; text-align:left; border-top:1px solid #666666; padding:2px; width:100%; color:coral; }'
		+ '.DM_Tooltip_Income { font-weight:bold; padding:2px; color:#50ff7f; position:absolute; bottom:18px; right:0px; }'
		+ '.DM_Tooltip_Time { font-weight:bold; text-align:right; padding:2px; padding-top:0px; }'
		+ '.DM_Tooltip_CPI { font-weight:bold; padding:2px; padding-top:0px; position:absolute; bottom:0px; left:0px; }'
		+ '.DM_Item_Best { background-color:#cdffd3 !important; } '
		+ '.DM_Item_Best:hover { background-color:#7eff8f !important; } '
		+ '.DM_Item_Avg { background-color:#f9ffcd !important; } '
		+ '.DM_Item_Avg:hover { background-color:#f1ff7e !important; } '
		+ '.DM_Item_Bad { background-color:#ffeccd !important; } '
		+ '.DM_Item_Bad:hover { background-color:#ffcf7e !important; } '
		+ '.DM_Item_Worst { background-color:#ffd3cd !important; } '
		+ '.DM_Item_Worst:hover { background-color:#ff8f7e !important; } '
		+ '#DM_Drip_Auth_Overlay { display:none; position:fixed; z-index:1001; top:0px; left:0px; bottom:0px; right:0px; background:rgba(0,0,0,0.5); }'
		+ '#DM_Drip_Auth_Window { position:absolute; width:350px; top:200px; left:50%; margin-left:-175px; box-sizing:border-box; -webkit-box-shadow: 5px 5px 15px 0px rgba(0,0,0,0.75); -moz-box-shadow: 5px 5px 15px 0px rgba(0,0,0,0.75); box-shadow: 5px 5px 15px 0px rgba(0,0,0,0.75); } '
	+ '');

	$("head").append("<style id='datamonster_style_optional'></style>");
	
	$("body").append('<div id="DM_Bar" class="navbar-inverse"></div>');
	$("body").append('<div id="DM_Config_Panel">' + DM_Config_Display() + '</div>');
	
	$($("#btn-addGlobalMem").parent()).append('<button id="DM_Drip_Button" type="button" style="display:none;" class="btn btn-lg btn-success"><i class="fa fa-lock"></i> Drip Memory</button>');
	$("body").append('<div id="DM_Drip_Auth_Overlay">' + DM_Drip_Auth_Window() + '</div>');
	$('#DM_Drip_Button').bind("click",function(){ Drip_Auth(); });
	$('#DM_Drip_Auth_Yes').bind("click",function(){ Drip_Auth_Click(true); });
	$('#DM_Drip_Auth_No').bind("click",function(){ Drip_Auth_Click(false); });
	
	Init_Options();
	
	$($($('.navbar-nav')[0]).children()[1]).html('<a style="cursor:pointer;"><i class="fa fa-gamepad"></i>&nbsp;Game</a>');
	$($($('.navbar-nav')[0]).children()[1]).bind("click",function(){
		if(_DM_Config_Open){ Toggle_DM_Config(); }
		else{ NavbarAccount.navigateAway(); window.location = '/game'; }
	});
	
	$($('.navbar-nav')[0]).append('<li><a id="DM_Config"><i class="fa fa-cog"></i>&nbsp;Datamonster</a></li>');
	$("#DM_Config").bind("click",function(){ Toggle_DM_Config(); });
	
	$(document).click(function(e) {
		if(_DM_Config_Open){ Toggle_DM_Config(); }
	});
	
	$("#DM_Config_Panel").click(function(e) {
		e.stopPropagation();
	});
	
	$($('#bps-current').parent()).append('<div id="DM_Personal_Averages"></div>');
	
	var curBytes = localStats.byteCount;
	_estimatedBps[1] = [0,curBytes,0];
	_estimatedBps[10] = [0,curBytes,0];
	_estimatedBps[30] = [0,curBytes,0];
	_estimatedBps[60] = [0,curBytes,0];
	
	var curBytesGlobal = globalStats.remainingBytes();
	_estimatedBpsGlobal[30] = [0,curBytesGlobal,0];
	_estimatedBpsGlobal[60] = [0,curBytesGlobal,0];
	_estimatedBpsGlobal[180] = [0,curBytesGlobal,0];
	_estimatedBpsGlobal[600] = [0,curBytesGlobal,0];
	
	jQuery.each($('#powerupstore .storeItem'), function(i, e){
		$(this).bind("click",function(){ Manage_Tooltips(i); });
	});
	
	_DM_Tooltip_Last = storeUI.shownUpgrades;
	
	Make_Table();
	Make_Personal_Averages_Table();
	Load_DM_Data();
	Handle_Loaded_Data();
	Main_Loop();
}

function Main_Loop(){
	Calculate_Estimates();
	Calculate_Items();
	Update_Table();
	Check_Styling();
	Check_Personal_Averages();
	Check_Tooltips();
	Manage_Coloring();
	Manage_Drip_Auth();
    setTimeout(function (){
        Main_Loop();
    },100)
}

function Manage_Drip_Auth(){
	if(_DM_Data['Drip Check'] && $('#DM_Drip_Button').is(':hidden')){
		$('#btn-addGlobalMem').hide();
		$('#DM_Drip_Button').show();
	} else if(!_DM_Data['Drip Check'] && !$('#DM_Drip_Button').is(':hidden')){
		$('#DM_Drip_Button').hide();
		$('#btn-addGlobalMem').show();
	}
}

function Drip_Auth(){
	$('#DM_Drip_Auth_Overlay').fadeIn(100);
}

function Drip_Auth_Click(tf){
	if(tf){
		$('#btn-addGlobalMem').click();
	}
	$('#DM_Drip_Auth_Overlay').fadeOut(100);
}

function DM_Drip_Auth_Window(){
	var out = '<div id="DM_Drip_Auth_Window">'
		+ '<div class="panel panel-primary" style="margin:0px; cursor:default; background-color:transparent;">'
			+ '<div class="panel-heading">'
				+ '<h3 class="panel-title"><b>Drip Memory Confirmation</b></h3>'
			+ '</div>'
			+ '<div class="panel-body" style="background-color:white;">'
				+ 'Are you sure you want to drip your memory?'
				+ '<div style="margin-top:15px;"><center>'
					+ '<button id="DM_Drip_Auth_Yes" type="button" class="btn btn-success" style="width:75px; margin-right:15px;">Yes</button>'
					+ '<button id="DM_Drip_Auth_No" type="button" class="btn btn-danger" style="width:75px;">No</button>'
				+ '</center></div>'
			+ '</div>'
		+ '</div>'
	+ '</div>';
	return out;
}

function Manage_Coloring(){
	if(_DM_Data['Color Items']){
		_DM_Color_Items_Toggle = true;
		var pInfo = localStats.powerUps;
		var uInfo = storeUI.shownUpgrades;
		var type = [_storeInfo['CPI']['low']['type'], _storeInfo['CPI']['high']['type']];
		var id = [_storeInfo['CPI']['low']['id'], _storeInfo['CPI']['high']['id']];
		var val = [_storeInfo['CPI']['low']['val'], _storeInfo['CPI']['high']['val']];
		jQuery.each($('#powerupstore .storeItem'), function(i, e){
			Remove_Color_Classes(this);
			var cpi = pInfo[i].currentPrice/pInfo[i].currentBps;
			if(i == id[0] && type[0] == "pu"){
				$(this).addClass('DM_Item_Best');
			} else if(i == id[1] && type[1] == "pu"){
				$(this).addClass('DM_Item_Worst');
			} else if(_storeInfo['CPI']['high']['val'] - cpi < cpi - _storeInfo['CPI']['low']['val']){
				$(this).addClass('DM_Item_Bad');
			} else {
				$(this).addClass('DM_Item_Avg');
			}
		});
		jQuery.each($('#upgrades .upgcontainer'), function(i, e){
			Remove_Color_Classes(this);
			var cpi = uInfo[i].price/Calc_Income_Bonus(uInfo[i].desc);
			if(i == id[0] && type[0] == "upg"){
				$(this).addClass('DM_Item_Best');
			} else if(i == id[1] && type[1] == "upg"){
				$(this).addClass('DM_Item_Worst');
			} else if(_storeInfo['CPI']['high']['val'] - cpi < cpi - _storeInfo['CPI']['low']['val']){
				$(this).addClass('DM_Item_Bad');
			} else {
				$(this).addClass('DM_Item_Avg');
			}
		});
	} else if(!_DM_Data['Color Items'] && _DM_Color_Items_Toggle){
		jQuery.each($('#powerupstore .storeItem'), function(i, e){ Remove_Color_Classes(this); });
		jQuery.each($('#upgrades .upgcontainer'), function(i, e){ Remove_Color_Classes(this); });
		_DM_Color_Items_Toggle = false;
	}
}

function Remove_Color_Classes(e){
	$(e).removeClass('DM_Item_Best');
	$(e).removeClass('DM_Item_Avg');
	$(e).removeClass('DM_Item_Bad');
	$(e).removeClass('DM_Item_Worst');
}

function Check_Tooltips(){
	if(_DM_Data['Tooltips'] && !_DM_Tooltip_Toggle){
		$('#tooltipAnchor').css('cssText', 'display:none !important;');
		_DM_Tooltip_Toggle = true;
		Manage_Tooltips(-1);
	} else if(!_DM_Data['Tooltips'] && _DM_Tooltip_Toggle){
		$('#tooltipAnchor').css('cssText', 'display:none;');
		_DM_Tooltip_Toggle = false;
		jQuery.each($('#powerupstore .storeItem'), function(i, e){
			$(this).tooltip('destroy');
		});
		jQuery.each($('#upgrades .upgcontainer'), function(i, e){
			$(this).tooltip('destroy');
		});
	}
	
	if(_DM_Data['Tooltips']){
		Update_Tooltip_Time();
	}
	
	if(storeUI.shownUpgrades != _DM_Tooltip_Last){
		_DM_Tooltip_Last = storeUI.shownUpgrades;
		Manage_Tooltips(-1);
	}
}

function Update_Tooltip_Time(){
	var ls = localStats;
	var type = [_storeInfo['Time']['low']['type'], _storeInfo['Time']['high']['type']];
	var id = [_storeInfo['Time']['low']['id'], _storeInfo['Time']['high']['id']];
	var val = [_storeInfo['Time']['low']['val'], _storeInfo['Time']['high']['val']];
	var c = '';
	
	jQuery.each(ls.powerUps, function(i, o){
		var ele = $('#DM_Tooltip_Time_pu' + i);
		if(ele.length > 0){

			var avgBps = ls.bps
			if(_DM_Data['Time Left Average']){ avgBps = _estimatedBps[10][2]; }
			var time = (o.currentPrice - ls.byteCount) / avgBps;
			if(time < 0) { time = 0; }

			if(time == 0) { c = '#7ACBF4'; }
			else if(time <= _storeInfo['Time']['low']['val']) { c = '#00FF00'; }
			else if(time >= _storeInfo['Time']['high']['val']) { c = '#FF0000'; }
			else if(_storeInfo['Time']['high']['val'] - time < time - _storeInfo['Time']['low']['val']){ c = "#FF7F00"; }
			else { c = '#FFFF00'; }

			$(ele).css('color', c);
			$(ele).text(formatTime(time, 'min'));
		}
	});
	
	jQuery.each(storeUI.shownUpgrades, function(i, o){
		var ele = $('#DM_Tooltip_Time_upg' + i);
		if(ele.length > 0){

			var avgBps = ls.bps
			if(_DM_Data['Time Left Average']){ avgBps = _estimatedBps[10][2]; }
			var time = (o.price - ls.byteCount) / avgBps;
			if(time < 0) { time = 0; }

			if(time == 0) { c = '#7ACBF4'; }
			else if(time <= _storeInfo['Time']['low']['val']) { c = '#00FF00'; }
			else if(time >= _storeInfo['Time']['high']['val']) { c = '#FF0000'; }
			else if(_storeInfo['Time']['high']['val'] - time < time - _storeInfo['Time']['low']['val']){ c = "#FF7F00"; }
			else { c = '#FFFF00'; }

			$(ele).css('color', c);
			$(ele).text(formatTime(time, 'min'));
		}
	});
}

function Manage_Tooltips(id){
	var pInfo = localStats.powerUps;
	var uInfo = storeUI.shownUpgrades;
	jQuery.each($('#powerupstore .storeItem'), function(i, e){
		$(this).tooltip('destroy');
		$(this).attr('data-toggle', 'tooltip');
		$(this).attr('data-placement', 'left');
		$(this).attr('data-html', 'true');
		$(this).attr('data-animation', 'false');
		$(this).attr('title', Create_Tooltip(pInfo[i], false, i));
		if(_DM_Data['Tooltips']) { $(this).tooltip(); }
	});
	
	jQuery.each($('#upgrades .upgcontainer'), function(i, e){
		$(this).tooltip('destroy');
		$(this).attr('data-toggle', 'tooltip');
		$(this).attr('data-placement', 'left');
		$(this).attr('data-html', 'true');
		$(this).attr('data-animation', 'false');
		$(this).attr('title', Create_Tooltip(uInfo[i], true, i));
		if(_DM_Data['Tooltips']) { $(this).tooltip(); }
	});
	
	if(id != -1){ $('#pu' + (id + 1)).tooltip('show'); }
}

function Create_Tooltip(pInfo, tf, id){
	if(!tf){
		var v = (pInfo.currentPrice/pInfo.currentBps);
		var c = '#FFFF00';
		
		if(v <= _storeInfo['CPI']['low']['val']) { c = '#00FF00'; }
		else if(v >= _storeInfo['CPI']['high']['val']) { c = '#FF0000'; }
		else if(_storeInfo['CPI']['high']['val'] - v < v - _storeInfo['CPI']['low']['val']){ c = "#FF7F00"; }
			
		var ups = '';
		jQuery.each(pInfo.purchasedUpgrades, function(i, e){
			ups += '<li>' + e.name + '</li>';
		});
		if(ups != ''){ ups = '</br></br><b style="color:#ffffff">Upgrades</b><ul>' + ups + '</ul>'}
		var out = '<div class="DM_Tooltip">'
			+ '<div class="DM_Tooltip_Header">' + pInfo.name + '</div>'
			+ '<div class="DM_Tooltip_Count">' + pInfo.count + '</div>'
			+ '<div class="DM_Tooltip_Description">'
				+ pInfo.desc
				+ ups
			+ '</div>'
			+ '<div class="DM_Tooltip_Footer">-' + formatNum(pInfo.currentPrice) + '</div>'
			+ '<div class="DM_Tooltip_Income">+' + formatNum(pInfo.currentBps) + '/s</div>'
			+ '<div class="DM_Tooltip_Time" id="DM_Tooltip_Time_pu' + id + '">&nbsp;</div>'
			+ '<div class="DM_Tooltip_CPI" style="color:' + c + ';">' + formatNum(v) + '</div>'
		+ '</div>';
	} else {
		var bonus = Calc_Income_Bonus(pInfo.desc);
		
		var v = (pInfo.price/bonus);
		var c = '#FFFF00';
		
		if(v <= _storeInfo['CPI']['low']['val']) { c = '#00FF00'; }
		else if(v >= _storeInfo['CPI']['high']['val']) { c = '#FF0000'; }
		else if(_storeInfo['CPI']['high']['val'] - v < v - _storeInfo['CPI']['low']['val']){ c = "#FF7F00"; }
		
		var out = '<div class="DM_Tooltip">'
			+ '<div class="DM_Tooltip_Header">' + pInfo.name + '</div>'
			+ '<div class="DM_Tooltip_Description">'
				+ '<span style="color:#dfdfdf">' + pInfo.desc + '</span>'
			+ '</div>'
			+ '<div class="DM_Tooltip_Footer">-' + formatNum(pInfo.price) + '</div>'
			+ '<div class="DM_Tooltip_Income">+' + formatNum(bonus) + '/s</div>'
			+ '<div class="DM_Tooltip_Time" id="DM_Tooltip_Time_upg' + id + '">&nbsp;</div>'
			+ '<div class="DM_Tooltip_CPI" style="color:' + c + ';">' + formatNum(v) + '</div>'
		+ '</div>';

	}
	return out + '<script>Update_Tooltip_Time();</script>';
}

function Calc_Income_Bonus(desc){
	switch(desc){
		case 'Cursor generates 1.1x more objects.<br/>Coffe cup clicks generate 10% of BPS':
		case 'Cursor generates 1.1x more objects.<br/>Coffe cup clicks generate additional 10% of BPS':
			return (localStats.powerUps[0].currentBps * 0.1) * localStats.powerUps[0].count;
			break;
			
		case 'Brogrammers generates 1.1x more memory':
			return (localStats.powerUps[1].currentBps * 0.1) * localStats.powerUps[1].count;
			break;
			
		case 'GC Failure  generates 1.1x more memory':
			return (localStats.powerUps[2].currentBps * 0.1) * localStats.powerUps[2].count;
			break;
			
		case 'Memory Leak  generates 1.1x more memory':
			return (localStats.powerUps[3].currentBps * 0.1) * localStats.powerUps[3].count;
			break;
			
		case 'Message Queue  generates 1.1x more memory':
			return (localStats.powerUps[4].currentBps * 0.1) * localStats.powerUps[4].count;
			break;
			
		case 'Database generates 1.1x more memory':
			return (localStats.powerUps[5].currentBps * 0.1) * localStats.powerUps[5].count;
			break;
			
		case 'Cache  generates 1.1x more memory':
			return (localStats.powerUps[6].currentBps * 0.1) * localStats.powerUps[6].count;
			break;
			
		case 'CPU  generates 1.1x more memory':
			return (localStats.powerUps[7].currentBps * 0.1) * localStats.powerUps[7].count;
			break;
			
		case 'GPU  generates 1.1x more memory':
			return (localStats.powerUps[8].currentBps * 0.1) * localStats.powerUps[8].count;
			break;
			
		case 'Cluster  generates 1.1x more memory':
			return (localStats.powerUps[9].currentBps * 0.1) * localStats.powerUps[9].count;
			break;
	}
	return 0;
}

function Toggle_DM_Config(){
	jQuery.each($($('.navbar-nav')[0]).children(), function(){
		$(this).removeClass('active');
	});
	if(!_DM_Config_Open){
		$('#DM_Config').parent().addClass('active');
		$('#DM_Config_Panel').animate({
			height: 200
		},{
			duration: 100,
			queue: false,
			complete: function(){
				$('#DM_Config_Display').fadeIn(100);
				_DM_Config_Open = true;
			}
		});
	} else {
		$($($('.navbar-nav')[0]).children()[1]).addClass('active');
		$('#DM_Config_Panel').animate({
			height: 0
		},{
			duration: 100,
			queue: false,
			complete: function(){
				$('#DM_Config_Display').fadeOut(0);
				_DM_Config_Open = false;
			}
		});
	}
}

function Check_Styling(){
	if(_DM_Data['Clean Dripstat'] && $("#datamonster_style_optional").text() == ''){
		$("#datamonster_style_optional").text(''
			+ '#heap-count-current { font-size:24px; }'
			+ '#middleColumn .progress { height:36px; }'
			+ '#heap-count-current-bytesDiv { line-height:36px; top:0px; }'
			+ '#heap-count-current-bytes { font-size:12px; }'
			+ '#bps-current { font-size: 14px; }'
			+ '#bps-current-bytes { font-size: 12px; top:0px; }'
			+ '#powerupstore { min-width:275px; margin-top:2px; }'
			+ '.storeItem { height:48px; background-size:contain; border-bottom:0px; overflow:hidden; }'
			+ '#pu10 { border-bottom:1px solid; }'
			+ '.storeItemAmount { font-size:32px; line-height:46px; }'
			+ '.storeItemName { margin-bottom:-5px; padding-left:46px; }'
			+ '.storePrice { padding-left:46px; }'
			+ '#upgrades .upgcontainer { margin-right:1px; margin-top:1px; border-color:#000; }'
			+ '#upgrades .item { height:50px; margin-bottom:4px; }'
			+ '#upgrades:hover { margin-bottom:-1px; } '
			+ 'h3 { margin-bottom:0px; }'
			+ '#globalHeapText { font-size:14px; }'
			+ '#globalInfo { margin-top:-5px; } '
			+ '.pop { font-size:16px; }'
			+ '.disabled { opacity:0.6; }'
			+ '#global-heap-count-remaining { font-size:12px; font-weight:bold; }'
			+ '.progress-striped { line-height:20px; height:24px; }'
			+ '#btn-addMem { margin-top:-10px; margin-bottom:5px; }'
		+ '');
	} else if (!_DM_Data['Clean Dripstat'] && $("#datamonster_style_optional").text() != ''){
		$("#datamonster_style_optional").text('');
	}
	
	/*
	if(_DM_Data['Hide Upgrades'] && $("#upgrades").text() == '' && $("#upgrades").is(":visible")){
		$("#upgrades").hide();
	} else if(!_DM_Data['Hide Upgrades'] && !$("#upgrades").is(":visible")){
		$("#upgrades").show();
	}
	*/
}

function Check_Personal_Averages(){
	if(_DM_Data['Show Personal Averages'] && (!$('#bps-current').is(':hidden') || !$('#bps-current-bytes').is(':hidden'))){
		$('#bps-current').hide();
		$('#bps-current-bytes').hide();
	}

	if(_DM_Data['Show Personal Averages'] && $('#DM_Personal_Averages').is(':hidden')){
		$('#bps-current').hide();
		$('#bps-current-bytes').hide();
		$('#DM_Personal_Averages').show();
	} else if(!_DM_Data['Show Personal Averages'] && !$('#DM_Personal_Averages').is(':hidden')){
		$('#DM_Personal_Averages').hide();
		$('#bps-current').show();
		$('#bps-current-bytes').show();
	}
	
	if(_DM_Data['Show Personal Averages']){
		Update_Personal_Averages();
	}
}

function Init_Options(){
	$('#DM_Option_0').bind("change",function(){ Save_DM_Data(); });
	$('#DM_Option_1').bind("change",function(){ Save_DM_Data(); });
	$('#DM_Option_2').bind("change",function(){ Save_DM_Data(); });
	$('#DM_Option_3').bind("change",function(){ Save_DM_Data(); });
	$('#DM_Option_4').bind("change",function(){ Save_DM_Data(); });
	$('#DM_Option_5').bind("change",function(){ Save_DM_Data(); });
	$('#DM_Option_6').bind("change",function(){ Save_DM_Data(); });
}

function Load_DM_Data(){
	if (typeof Storage !== "undefined"){
		if(localStorage.DM_Data != undefined){
			var json = JSON.parse(localStorage.DM_Data);
			if(json['version'] == _version){
				_DM_Data = json;
				return;
			}
		}
	}
	Save_DM_Data();
}

function Save_DM_Data(){
	var obj = new Object();
		obj['version'] = _version;
	
	if($('#DM_Option_0').is(':checked')) { obj['Show Bottom Bar'] = true; }
	else { obj['Show Bottom Bar'] = false; }
	
	if($('#DM_Option_1').is(':checked')) { obj['Clean Dripstat'] = true; }
	else { obj['Clean Dripstat'] = false; }
	
	if($('#DM_Option_2').is(':checked')) { obj['Tooltips'] = true; }
	else { obj['Tooltips'] = false; }
	
	if($('#DM_Option_3').is(':checked')) { obj['Show Personal Averages'] = true; }
	else { obj['Show Personal Averages'] = false; }
	
	if($('#DM_Option_4').is(':checked')) { obj['Time Left Average'] = true; }
	else { obj['Time Left Average'] = false; }
	
	if($('#DM_Option_5').is(':checked')) { obj['Color Items'] = true; }
	else { obj['Color Items'] = false; }
	
	if($('#DM_Option_6').is(':checked')) { obj['Drip Check'] = true; }
	else { obj['Drip Check'] = false; }
	
	if (typeof Storage !== "undefined"){
		localStorage.DM_Data = JSON.stringify(obj);
	}
	_DM_Data = obj;
}

function Handle_Loaded_Data(){
	if(_DM_Data['Show Bottom Bar']) { $('#DM_Option_0').prop('checked', true); }
	else { $('#DM_Option_0').prop('checked', false);}
	
	if(_DM_Data['Clean Dripstat']) { $('#DM_Option_1').prop('checked', true); }
	else { $('#DM_Option_1').prop('checked', false);}
	
	if(_DM_Data['Tooltips']) { $('#DM_Option_2').prop('checked', true); }
	else { $('#DM_Option_2').prop('checked', false);}
	
	if(_DM_Data['Show Personal Averages']) { $('#DM_Option_3').prop('checked', true); }
	else { $('#DM_Option_3').prop('checked', false);}
	
	if(_DM_Data['Time Left Average']) { $('#DM_Option_4').prop('checked', true); }
	else { $('#DM_Option_4').prop('checked', false);}
	
	if(_DM_Data['Color Items']) { $('#DM_Option_5').prop('checked', true); }
	else { $('#DM_Option_5').prop('checked', false);}
	
	if(_DM_Data['Drip Check']) { $('#DM_Option_6').prop('checked', true); }
	else { $('#DM_Option_6').prop('checked', false);}
}

function DM_Config_Display(){
	var out = '<div id="DM_Config_Display">'
		+ '<div class="container">'
			+ '<div class="row">'
				+ '<div class="col-md-4">'
					+ '<h3 style="font-weight:bold; color:#c1e7fa; margin-bottom:0px;">Datamonster Config <small>' + _version + '</small></h3>'
					+ '<hr style="margin-top:0px; margin-bottom:0px;">'
				+ '</div>'
			+ '</div>'
		+ '</div>'
		+ '<div class="container">'
			+ '<div class="row">'
				+ '<div class="col-md-4">'
					+ '<div class="DM_Config_Item">'
						+ '<label><input type="checkbox" id="DM_Option_0"> Show Bottom Bar</label>'
					+ '</div>'
					+ '<div class="DM_Config_Item">'
						+ '<label><input type="checkbox" id="DM_Option_1"> Re-Style/Clean DripStat\'s UI</label>'
					+ '</div>'
					+ '<div class="DM_Config_Item">'
						+ '<label><input type="checkbox" id="DM_Option_2"> Use Datamonster\'s Tooltips</label>'
					+ '</div>'
					+ '<div class="DM_Config_Item">'
						+ '<label><input type="checkbox" id="DM_Option_3"> Show Personal Income Averages</label>'
					+ '</div>'
				+ '</div>'
				+ '<div class="col-md-4" style="border-left:1px solid #333333;">'
					+ '<div class="DM_Config_Item">'
						+ '<label><input type="checkbox" id="DM_Option_4"> Calculate "Time Left" From 10 Second Average</label>'
					+ '</div>'
					+ '<div class="DM_Config_Item">'
						+ '<label><input type="checkbox" id="DM_Option_5"> Color-Code Store Items</label>'
					+ '</div>'
					+ '<div class="DM_Config_Item">'
						+ '<label><input type="checkbox" id="DM_Option_6"> "Drip Memory" Confirmation</label>'
					+ '</div>'
				+ '</div>'
			+ '</div>'
		+ '</div>'
	return out + '</div>';
}

function Make_Personal_Averages_Table(){
	var out = '<table style="width:100%; table-layout:fixed;">'
		+ '<tr style="color:#333333;">'
			+ '<th>Game</th>'
			+ '<th>1 Second</th>'
			+ '<th>10 Second</th>'
			+ '<th>30 Second</th>'
			+ '<th>1 Minute</th>'
		+ '</tr>'
		+ '<tr style="color:coral; font-size:14; font-weight:bolder;">'
			+ '<td id="DM_Personal_Game"></td>'
			+ '<td id="DM_Personal_1"></td>'
			+ '<td id="DM_Personal_10"></td>'
			+ '<td id="DM_Personal_30"></td>'
			+ '<td id="DM_Personal_60"></td>'
		+ '</tr>'
	+ '</table>';
	$('#DM_Personal_Averages').html(out);
}

function Update_Personal_Averages(){
	$('#DM_Personal_Game').text(formatNum(localStats.bps) + '/s');
	$('#DM_Personal_1').text(formatNum(_estimatedBps[1][2]) + '/s');
	$('#DM_Personal_10').text(formatNum(_estimatedBps[10][2]) + '/s');
	$('#DM_Personal_30').text(formatNum(_estimatedBps[30][2]) + '/s');
	$('#DM_Personal_60').text(formatNum(_estimatedBps[60][2]) + '/s');
}

function Calculate_Estimates(){
	Calculate_Estimated_BPS(1);
	Calculate_Estimated_BPS(10);
	Calculate_Estimated_BPS(30);
	Calculate_Estimated_BPS(60);
	
	Calculate_Estimated_BPS_Global(30);
	Calculate_Estimated_BPS_Global(60);
	Calculate_Estimated_BPS_Global(180);
	Calculate_Estimated_BPS_Global(600);
}

function Calculate_Estimated_BPS(type){
	if(_estimatedBps[type][0] >= type * 10){ // counter (100ms per loop)
		var current = localStats.byteCount;
		var last = _estimatedBps[type][1];
		var increase = current - last;
		_estimatedBps[type][2] = increase / type;
		_estimatedBps[type][1] = current;
		_estimatedBps[type][0] = 0; // reset counter
	}
	_estimatedBps[type][0]++; // increment counter
}

function Calculate_Estimated_BPS_Global(type){
	if(_estimatedBpsGlobal[type][0] >= type * 10){ // counter (100ms per loop)
		var current = globalStats.remainingBytes();
		var last = _estimatedBpsGlobal[type][1];
		var decrease = last - current;
		_estimatedBpsGlobal[type][2] = decrease / type;
		_estimatedBpsGlobal[type][1] = current;
		_estimatedBpsGlobal[type][0] = 0; // reset counter
	}
	_estimatedBpsGlobal[type][0]++; // increment counter
}

function Calculate_Items(){
	var ls = localStats;
	var items = ls.powerUps;
	var ups = storeUI.shownUpgrades;
	
	_storeInfo['CPI'] = new Object();
	_storeInfo['CPI']['low'] = { type:"", id:0, val:0 };
	_storeInfo['CPI']['high'] = { type:"", id:0, val:0 };
	
	_storeInfo['Time'] = new Object();
	_storeInfo['Time']['low'] = { type:"", id:0, val:Number.MAX_VALUE };
	_storeInfo['Time']['high'] = { type:"", id:0, val:0 };
	
// Regular Store Items
	jQuery.each(items, function(i, o){ // index, object
		var cpi = o.currentPrice/o.currentBps;
		if(i == 0 || cpi < _storeInfo['CPI']['low']['val']){
			_storeInfo['CPI']['low']['type'] = "pu";
			_storeInfo['CPI']['low']['id'] = i;
			_storeInfo['CPI']['low']['val'] = cpi;
		}
		if(cpi > _storeInfo['CPI']['high']['val']){
			_storeInfo['CPI']['high']['type'] = "pu";
			_storeInfo['CPI']['high']['id'] = i;
			_storeInfo['CPI']['high']['val'] = cpi;
		}
		
		var avgBps = ls.bps
		if(_DM_Data['Time Left Average']){ avgBps = _estimatedBps[10][2]; }
		var time = (o.currentPrice - ls.byteCount) / avgBps;
		if(time < 0) { time = 0; }
		if(time != 0){
			if(i == 0 || time < _storeInfo['Time']['low']['val']){
				_storeInfo['Time']['low']['type'] = "pu";
				_storeInfo['Time']['low']['id'] = i;
				_storeInfo['Time']['low']['val'] = time;
			}
			if(time > _storeInfo['Time']['high']['val']){
				_storeInfo['Time']['high']['type'] = "pu";
				_storeInfo['Time']['high']['id'] = i;
				_storeInfo['Time']['high']['val'] = time;
			}
		}
	});
	
// Store Upgrades
	jQuery.each(ups, function(i, o){ // index, object
		var cpi = o.price/Calc_Income_Bonus(o.desc);
		if(cpi < _storeInfo['CPI']['low']['val']){
			_storeInfo['CPI']['low']['type'] = "upg";
			_storeInfo['CPI']['low']['id'] = i;
			_storeInfo['CPI']['low']['val'] = cpi;
		}
		if(cpi > _storeInfo['CPI']['high']['val']){
			_storeInfo['CPI']['high']['type'] = "upg";
			_storeInfo['CPI']['high']['id'] = i;
			_storeInfo['CPI']['high']['val'] = cpi;
		}
		
		var avgBps = ls.bps
		if(_DM_Data['Time Left Average']){ avgBps = _estimatedBps[10][2]; }
		var time = (o.price - ls.byteCount) / avgBps;
		if(time < 0) { time = 0; }
		if(time != 0){
			if(time < _storeInfo['Time']['low']['val']){
				_storeInfo['Time']['low']['type'] = "upg";
				_storeInfo['Time']['low']['id'] = i;
				_storeInfo['Time']['low']['val'] = time;
			}
			if(time > _storeInfo['Time']['high']['val']){
				_storeInfo['Time']['high']['type'] = "upg";
				_storeInfo['Time']['high']['id'] = i;
				_storeInfo['Time']['high']['val'] = time;
			}
		}
	});
}

function Make_Table(){
	var items = localStats.powerUps;
	var vars = ['', '', '', ''];
	vars[0] = '<td align=right style="color:#FFFF00;"><b>Datamonster ' + _version + '</b></td>';
	items.forEach(function(e,t){
		vars[0] += '<th align=middle id="DM_Item_Name_' + t + '" style="font-weight:bold;"></th>';
		vars[1] += '<td align=middle id="DM_Item_Income_' + t + '"></td>';
		vars[2] += '<td align=middle id="DM_Item_CPI_' + t + '"></td>';
		vars[3] += '<td align=middle id="DM_Item_Time_' + t + '"></td>'
	});
	
	$("#DM_Bar").html(''
		+ '<table style="width:100%; table-layout:fixed;">'
			+ '<tr>' + vars[0] + '</tr>'
			+ '<tr><td align=right style="color:#4bb8f0;">Income</td>' + vars[1] + "</tr>"
			+ '<tr><td align=right style="color:#4bb8f0;">Cost Per Income</td>' + vars[2] + "</tr>"
			+ '<tr><td align=right style="color:#4bb8f0;">Time Left</td>' + vars[3] + "</tr>"
		+ "</table>"
	+ '');
}

function Update_Table(){
	if(_DM_Data['Show Bottom Bar']){
		if(!$('#DM_Bar').is(":visible")) { $('#DM_Bar').fadeIn(100); $("body").css('margin-bottom','72px'); }
		var items = localStats.powerUps;		
		items.forEach(function(e,t){
			var time = 0;
			var avgBps = localStats.bps
			if(_DM_Data['Time Left Average']){ avgBps = _estimatedBps[10][2]; }
			if(e.currentPrice - localStats.byteCount > 0){ time = (e.currentPrice - localStats.byteCount) / avgBps; }
			if(time < 0 ) { time = 0; }
			var n = Get_Item_Name_Display(e.name);
			var v = (e.currentPrice/e.currentBps);
			var c = ['#FFFF00', '#FFFF00'];
			
			if(v <= _storeInfo['CPI']['low']['val']) { c[0] = '#00FF00'; }
			else if(v >= _storeInfo['CPI']['high']['val']) { c[0] = '#FF0000'; }
			else if(_storeInfo['CPI']['high']['val'] - v < v - _storeInfo['CPI']['low']['val']){ c[0] = "#FF7F00"; }
			
			if(time == 0) { c[1] = '#7ACBF4'; }
			else if(time <= _storeInfo['Time']['low']['val']) { c[1] = '#00FF00'; }
			else if(time >= _storeInfo['Time']['high']['val']) { c[1] = '#FF0000'; }
			else if(_storeInfo['Time']['high']['val'] - time < time - _storeInfo['Time']['low']['val']){ c[1] = "#FF7F00"; }
			
			$('#DM_Item_Name_' + t).html(n + ' (<span style="color:#4bb8f0;">' + e.count + '</span>)');
			$('#DM_Item_Income_' + t).html(formatNum(e.currentBps) + '/s');
			$('#DM_Item_CPI_' + t).html('<span style="color:' + c[0] + '">' + formatNum(v) + '</span>');
			$('#DM_Item_Time_' + t).html('<span style="color:' + c[1] + '">' +formatTime(time, 'min') + '</span>');
		});
	} else {
		if($('#DM_Bar').is(":visible")) { $('#DM_Bar').fadeOut(100); $("body").css('margin-bottom','0px'); }
	}
}

function Get_Item_Name_Display(name){
	name = name.replace('GC Failure', 'Failure');
	name = name.replace('Memory Leak', 'Leak');
	name = name.replace('Message Queue', 'Queue');
	return name;
}

function _sts(e, tf) {
	var num = 1;
    if (num > 0) {
		var mult = 1e15;
		for(var i = sts_type[num-1].length-1; i >= 0; i--) {
			var hold = (e / mult % 999).toFixed(2);
			if(hold >=1 ) return hold + sts_type[num-1][i];
			mult /= 1e3;
		}
    }
	if(tf) { return Math.round(e); }
    return Math.round(e * 100) / 100;
}

function formatNum(e) {
    return _sts(e, false).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

function formatTime(e, t) {
    e = Math.round(e);
    if (e == Infinity) { return "Never"; }
    if (e == 0) { return "Done!"; }
    if (e / 86400 > 1e3) { return "> 1,000 days"; }
    var n = parseInt(e / 86400) % 999;
    var r = parseInt(e / 3600) % 24;
    var i = parseInt(e / 60) % 60;
    var s = e % 60;
    var o = new Array(" days, ", " hours, ", " minutes, ", " seconds");
    if (t != "min") {
        if (n == 1) { o[0] = " day, "; }
        if (r == 1) { o[1] = " hour, "; }
        if (i == 1) { o[2] = " minute, "; }
        if (s == 1) { o[3] = " second"; }
    } else { o = new Array("d, ", "h, ", "m, ", "s"); }
    var u = '';
	if(n > 0) { u = u + n + o[0]; }
	if(n > 0 || r > 0) { u = u + r + o[1]; }
	if(n > 0 || r > 0 || i > 0) { u = u + i + o[2]; }
	if(n > 0 || r > 0 || i > 0 || s > 0) { u = u + s + o[3]; }
    return u
}