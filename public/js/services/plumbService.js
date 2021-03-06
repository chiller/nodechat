
app.factory('PlumbService',function ($rootScope, ConnectionDeleteService) {


    jsPlumb.importDefaults({
        Connector:["StateMachine",{ curviness:1 } ],
        PaintStyle:{ lineWidth:4, strokeStyle:"#52A529" },
        Endpoint:[ "Dot", { radius:1 } ],
        EndpointStyle:{ fillStyle:"#52A529" }   ,
        Anchor: "Continuous",
        Overlays : [
            [ "Arrow", {
                location:-1,
                id:"arrow",
                length:8,
                width:8,
                foldback:1
            } ]
        ]

    });



    return {
        setUpPlumbWithScope: function ($scope) {
            var connectAll = function() {
                console.log("Connecting: " + $scope.shared_document.connections.length)

                for (var i = $scope.shared_document.connections.length - 1; i >= 0; i--) {

                var t = $scope.shared_document.connections[i]
                if ($("#"+t.from.toString()).length == 0 || $("#"+t.to.toString()).length == 0) {
                    //TODO: rethink this
                    console.log("STALE CONNECTION")
                    $scope.shared_document.connections.splice(i, 1)
                    $scope.updateDocument();
                    continue
                }
                jsPlumb.connect({
                    scope: t,
                    source:$("#"+t.from.toString()),
                    target:$("#"+t.to.toString()),
                    label: t.label
                });


            }}

            var deleteConnection = function(){
                var conn_object = connection.scope;
                $scope.shared_document.connections.splice($scope.shared_document.connections.indexOf(conn_object), 1);
                jsPlumb.detach(connection);
                $scope.$apply();
                //$scope.updateDocument();
                console.log(ConnectionDeleteService);
                ConnectionDeleteService.delete({_id: $scope.shared_document._id, from:conn_object.from, to:conn_object.to});
                //TODO: propagate changes
            }

            start = new Date();
            var shapes = $(".draggable");
            jsPlumb.detachEveryConnection();
            console.log("Loop start:" + ( new Date()-start));

            if (false){
                jsPlumb.doWhileSuspended( connectAll(),true);
                console.log("Loop end:" + ( new Date()-start));
                jsPlumb.repaintEverything();
                console.log("Repaint end:" + ( new Date()-start));
            } else{
                connectAll()
                console.log("Repaint end:" + ( new Date()-start));
            }

            console.log("Clickhandler start:" + ( new Date()-start));
            jsPlumb.bind('click', function (connection, e) {

                var idx = $scope.shared_document.connections.indexOf(connection.scope);
                $("path").each(function(){this.style.setProperty("stroke","#52A529")})
                e.target.style.setProperty("stroke","#75EE3B")
                $scope.selectedConnection = $scope.shared_document.connections[idx];
                $scope.selectedConnection_obj = connection
                $scope.selectedEntity = null;
                $scope.$apply();
            });

            console.log("End:" + ( new Date()-start));
        },
        addPlumb: function(connection) {
            var shapes = $(".draggable");
            jsPlumb.connect({
                scope: connection,
                curviness: 0,
                source:$("#"+connection.from.toString()),
                target:$("#"+connection.to.toString()),

            });
        }
    }},{$inject: ['ConnectionDeleteService']})
