
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
                var viewportElement = document.body.parentNode;
                var ghost = scope.ghost || true;

                var offset = scope.dragOffset || { left: -20, top: -10 };

                var clone;

                elem.on('mousedown', function(event) {
                    if (!clone) 
                        clone = angular.element(elem[0].outerHTML);
                    
                    if (ghost) {
                        clone.attr('id','dragOnDragGhost');
                        clone.css('opacity', attrs.dragOnGhostOpacity || 0.5);
                        //insert the ghosted copy of the element
                        elem[0].parentNode.insertBefore(clone[0],elem[0]);
                    }
                    
                    ddDragState.dragging = elem;
                    ddDragState.dragData = scope.ngModel || null;
                    
                    //attribute is set -.-
                    angular.element(elem).css('position','absolute');
                    angular.element(elem).css('display','block');
                    angular.element(document.body).css('user-select','none')
                    
                });

                angular.element(viewportElement).on('mousemove', function(event) {
                    //event fires -.- 
                    if (ddDragState.dragging !== false) {
                        //--fires correctly-- console.log('offset,mousemove',event.pageX,event.pageY);
                        angular.element(elem).css('zIndex',9999);
                        elem[0].style.left = event.pageX + offset.left + 'px';
                        
                        angular.element(elem).css('left', event.pageX + offset.left + 'px');
                        angular.element(elem).css('top',event.pageY + offset.top + 'px');
                        
                        event.preventDefault();
                    }
                });

                angular.element(viewportElement).on('mouseup', function(event) {
                        angular.element(elem).css('left', '');
                        angular.element(elem).css('top', '');
                        angular.element(elem).css('position', '');
                        angular.element(elem).css('z-index', '');
                        if (ghost) {
                            angular.element(document.getElementById('dragOnDragGhost')).remove();
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
                var viewportElement = document.body.parentNode;

        		var getDimensions = 
        	    	function(element) {
        	    	    element = angular.element(element)[0];//maybe some other element type, do this
                        var elm = angular.element(element);
        				var display = elm.css('display');
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

                var dim = getDimensions(elem);
                var offset = elem[0].getBoundingClientRect();

                var rect = {
                    top: offset.top, bottom: offset.top+dim.height,
                    left: offset.left, right: offset.left+dim.width
                };

                //pesky target moves
                angular.element(viewportElement).on('mousedown', function(event) {
                    
                    offset = elem[0].getBoundingClientRect();
                    rect = {
                        top: offset.top, bottom: offset.top+dim.height,
                        left: offset.left, right: offset.left+dim.width
                    };
                    
                });


                angular.element(viewportElement).on('mousemove', function(event) {
                   
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

                angular.element(viewportElement).on('mouseup', function(event) {
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
