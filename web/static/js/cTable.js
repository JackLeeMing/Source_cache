!function($){

	"use strict"

	var cTable = function(element, options) {
		this.init(element, options);
	};

	cTable.prototype = {
		constructor: cTable,

		init: function(element, options) {
			this.$element = $(element);
			this.options = $.extend({}, $.fn.cTable.defaults, options);
			this.template = $(this.options.template);
			this.active = this.options.data.active;

			this.$element.append(this.template);


			this.initNav();
			this.initTable();

			this.getTableByUrl(this.active);

			this.$element.on('click', 'tbody td', $.proxy(this.tdClickHandler, this));
			this.$element.on('click', '.c-nav a', $.proxy(this.navClickHandler, this));
		},

		initNav: function() {

			var navs = this.options.data.navs,
				moreNavs = this.options.data.moreNavs,
				active =  this.active;

			navs = navs instanceof Array && navs;

			if (navs) {

				var $cNav    = this.template.find('.c-nav'),
					$content = this.template.find('.tab-content');

				$.each(navs, function(i, v){

					var $a    = $('<a data-toggle="tab">'),
						$pane = $('<div class="tab-pane">'),
						$li   = $('<li>');

					if (v[v.length - 1] === active) {
						$li.addClass('active');
						$pane.addClass('active');
					}

					$a.text(v[0]);
					$a.attr('href', '#' + v[v.length - 1]);
					$pane.attr('id', v[v.length - 1]);

					$cNav.append($li.append($a));
					$content.append($pane);
				});
			}

			if (moreNavs) {
				$content = this.template.find('.tab-content');

				$('#more-li').removeClass('hide');

				$.each(moreNavs, function(i, v){
					var $li = $('<li role="presentation"><a tabindex="-1" role="tab" data-toggle="tab" href="#tab-report" type="BridgeCard" style="text-decoration: none;"></a></li>');
					var $pane = $('<div class="tab-pane">');

					$li.find('a').text(v[0]);
					$li.find('a').attr('href', '#' + v[v.length - 1]);
					$pane.attr('id', v[v.length - 1]);

					$('#more-li ul').append($li);
					$content.append($pane);
					$('.c-nav').append($('#more-li'));
				});
			}
		},

		initTable: function() {
			var tables = this.options.data.tables,
				table = this.options.data.table,
				hasBorder = this.options.hasBorder,
				statusContent = this.options.statusContent;

			if (table) return;

			tables = tables instanceof Object && tables;

			var thead = tables.thead;

			if (tables) {
				$.each(tables, function(k, v){
					var $pane  = $('#' + k),
						$table = $('<table class="table">'),
						$thead = $('<thead>'),
						$tbody = $('<tbody>'),
						$tr    = $('<tr>');

					if (hasBorder) {
						$table.addClass('table-bordered');
					}

					var tbody = v.tbody;

					$.each(thead, function(i, v){
						var $th = $('<th>');
						
						$th.text(v[0]);
						$th.attr('c-id', v[v.length - 1]);

						$tr.append($th);

					});

					$thead.append($tr);

					$.each(tbody, function(i, tr){
						$tr = $('<tr>');

						$.each(tr, function(i, td){
							var $td = $('<td>');

							if (td instanceof Array) {
								$td.text(td[0]);
								$td.attr('col', td[td.length - 1]);
							} else {
								// $td.text(td);
								$td.attr('status', td);
								$td.attr('col', thead[i][thead[i].length - 1]);
							}

							$tr.append($td);
						});

						$tbody.append($tr);
					});			

					$table.append($thead);
					$table.append($tbody);

					$pane .append($table);
				});
			}
		},

		navClickHandler: function(e) {
			var $a         = $(e.target),
				onNavClick = this.options.onNavClick;
			
		
			onNavClick($a);
		},

		tdClickHandler: function(e) {
			var $td = $(e.target),
				status = $td.attr('status'),
				onClick = this.options.onClick;

			onClick($td);
		},

		getTableByUrl: function(arg) {
			var url = this.options.data.table;
			var self = this;

			$.get(url, function(data){
				var table = data.data;
				$('#' + arg).empty();
				$('#' + arg).append(table);
				if(self.options.fncallback){
					self.options.fncallback();
				}
				
			});
		}
	};

	/* cTable PLUGIN DEFINITION
	 * ======================== */

	$.fn.cTable = function(option) {
		return this.each(function(){
			var $this   = $(this),
				data    = $this.data('cTable'),
				options = typeof option === 'object' && option;

			if (!data) {
				$this.data('cTable', (data = new cTable(this, options)) );
			}
		});
	};

	$.fn.cTable.defaults = {
		template: $('#cTable-template').text(),
		hasBorder: true,
		onClick: function(td) {

		},
		onNavClick: function(a) {

		}
	};

}(window.jQuery)