/**
 * Created by Neo on 12/12/2016.
 */
// Node ----------------------------------------------------------------

function Node(nodeData) {
    // Metadata
    this.nodeId = nodeData['node_id'];
    this.twitterHandle = nodeData['twitter_handle'];
    this.twitterUserId = nodeData['twitter_user_id'];

    // Geometry (Final Position)
    this.fp = nodeData['final_coordinates'];
    // Embedding process
    this.ep = nodeData['embedding_process'];

    // food id
    this.vegan = nodeData['vegan'];
    this.vegetarian = nodeData['vegetarian'];
    this.nonVeg = nodeData['non-veg'];
    this.paleo = nodeData['paleo'];
    this.pescetarian = nodeData['pescetarian'];


    // Twitter numbers
    this.statusCount = nodeData['statuses_count'];
    this.retweetCount = nodeData['retweet_count'];

    THREE.Vector3.call( this, this.ep[0][0], this.ep[0][1], this.ep[0][2] );
}

Node.prototype = Object.create( THREE.Vector3.prototype );

function CreateNodes(nl){
    var nodes= new Map();
    for(var i=0; i<nl.length; i++){
        nodes.set( nl[i]['node_id'],new Node(nl[i]));
    }
    return nodes;
}

