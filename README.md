angular-dragon-dropon
=====================
An angular directive that allows for simple, no frills drag and drop system.  Documentation in progress.

### Supported browsers

No tests have been made just yet.


### Usage

Download 'angular-dragon-dropon.js' and include it in your application. 

    <div>
        <button id="btnA" drag-on ng-model="buttonAData">A BUTTON</button>
        <button id="btnB" drag-on ng-model="buttonBData">B BUTTON</button>
        <button id="btnC" drag-on ng-model="buttonCData">C BUTTON</button>
    </div>

    <div drop-on dropped="dropTest" id="AItems" style="background: blue; width: 200px; min-height: 100px;">
        <ul>
            <li ng-repeat="item in dropAItems">
                {{item.name}}
            </li>
        </ul>
    </div>

    <div drop-on dropped="dropTest" id="BItems" style="background: red; width: 200px; min-height: 100px;">
        <ul>
            <li ng-repeat="item in dropBItems">
                {{item.name}}
            </li>
        </ul>
    </div>

    <div drop-on dropped="dropTest" id="CItems" style="background: green; width: 200px; min-height: 100px;">
        <ul>
            <li ng-repeat="item in dropCItems">
                {{item.name}}
            </li>
        </ul>
    </div>

Some rough test / example code to start with:

     yourModule.controller(function($scope) {
        $scope.buttonAData= { id:'buttonA', title: 'This is an A title', type: 'button' };
        $scope.buttonBData= { id:'buttonB', title: 'This is a B title', type: 'button' };
        $scope.buttonCData= { id:'buttonC', title: 'This is a C title', type: 'button' };

        $scope.dropAItems  =[];
        $scope.dropBItems  = [];
        $scope.dropCItems = [];

        $scope.dropTest = function(ddfrom,ddto) {
            var toId = angular.element(ddto).attr('id');
            $scope['drop'+toId].push({name: ddfrom.title });
        };
     });

