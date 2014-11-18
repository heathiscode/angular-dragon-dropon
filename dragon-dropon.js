
    angular.module('dragonDropon', []).value('ddDragState', {
        initialized: false,
        dragging: false,
        dragData: {},
        dropTarget: null
    }).directive('dragOn',['ddDragState', '$parse', function (ddDragState, $parse) {
        return {
            scope: {
              ngModel: '=',
	      type: '@',
              ghost: '@',
              dragOffset: '@'
            },
            link: function (scope,elem,attrs) {
                var ghost = this.ghost || true;

                var offset = scope.dragOffset || { left: -20, top: -10 };

                var clone = angular.element($(elem)[0].outerHTML);

                elem.on('mousedown', function(event) {
                    ddDragState.dragging = elem;
                    ddDragState.dragData = scope.ngModel || null;
                    angular.element(elem).css('position','absolute');
                    if (ghost) {
                        clone.attr('id','dragOnDragGhost');
                        clone.css('opacity',0.5);
                        //insert the ghosted copy of the element
                        clone.insertAfter(elem);
                    }
                });

                angular.element('html').on('mousemove', function(event) {
                    if (ddDragState.dragging !== false) {
                        angular.element(elem).css('z-index',9999);
                        angular.element(elem).css('left', event.pageX + offset.left + 'px');
                        angular.element(elem).css('top',event.pageY + offset.top + 'px');
                    }
                });

                angular.element('html').on('mouseup', function(event) {

                    if (ddDragState.dragging!==false) {
                        angular.element(elem).css('left', '');
                        angular.element(elem).css('top', '');
                        angular.element(elem).css('position', '');
                        angular.element(elem).css('z-index', '');
                        if (ghost) {
                            angular.element('#dragOnDragGhost').remove();
                        }
                    }

                });

            }
        }
    }]).directive('dropOn',['$parse','ddDragState', function($parse, ddDragState) {
        return {
            scope: {
                dropped: '=',
                allowedTypes: '='
            },
            link: function(scope,elem,attrs) {

		var getDimensions = 
	    		function(element) {
				element = $(element);
				var display = $(element).getStyle('display');
				if (display != 'none' && display != null) // Safari bug

				return { width: element.offsetWidth, height: element.offsetHeight};

				// All *Width and *Height properties give 0 on elements with display none,
				// so enable the element temporarily
				var els = element.style;
				var originalVisibility = els.visibility;
				var originalPosition = els.position;
				var originalDisplay = els.display;
				els.visibility = 'hidden';
				els.position = 'absolute';
				els.display = 'block';
				var originalWidth = element.clientWidth;
				var originalHeight = element.clientHeight;
				els.display = originalDisplay;
				els.position = originalPosition;
				els.visibility = originalVisibility;
				return {width: originalWidth, height: originalHeight};
			};

                var dim = getDimensions(element);
                var offset = elem.offset();

                var rect = {
                    top: offset.top, bottom: offset.top+dim.height,
                    left: offset.left, right: offset.left+dim.width
                };


                angular.element('html').on('mousemove', function(event) {
                    if (ddDragState.dragging !== false) {
                        var x = event.pageX;
                        var y = event.pageY;

                        if (x>=rect.left && x<=rect.right && y>=rect.top && y<=rect.bottom) {
                            elem.addClass('dropon-hover');
                            ddDragState.dropTarget = elem;
                            ddDragState.dropTarget.rect = rect;
                        } else {
                            elem.removeClass('dropon-hover');
                            if (ddDragState.dropTarget) {
                                if (x<ddDragState.dropTarget.rect.left || x>ddDragState.dropTarget.rect.right || y<ddDragState.dropTarget.rect.top || y>ddDragState.dropTarget.rect.bottom) {
                                    ddDragState.dropTarget = null;
                                }
                            }
                        }

                    }
                });

                angular.element('html').on('mouseup', function(event) {
                    elem.removeClass('dropon-hover');

                    if (ddDragState.dropTarget) {
                        scope.dropped(ddDragState.dragData || ddDragState.dragging, ddDragState.dropTarget);
                        scope.$apply();
                    }

                    ddDragState.dragData = null;
                    ddDragState.dropTarget = null;
                    ddDragState.dragging = false;

                });
            }
        }
    }]);



