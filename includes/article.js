var articles = require('./cloudant.js').articles;

// fetch unread articles from couchdb
var unreadArticles = function(callback) {
  
  // equivalent of CouchDB https://<server>:<port>/articles/_design/matching/_view/byts?limit=100&reduce=false&include_docs=true&descending=true&startkey=["unreadz"]&endkey=["unread"]
  // N.B. when doing doing descending=true with startkey/endkey, you must also swap startkey/endkey(!)
  articles.view('matching','byts', { limit: 100, reduce: false, include_docs: true, descending:true, startkey:["unread"+"z"],endkey: ["unread"]}, function(err,data) {
    if(!err) {
      var retval=[];
      for(var i in data.rows) {
        retval.push(data.rows[i].doc);
      }
    }

    callback(err,retval);
  })
}

// fetch read articles from couchdb
var readArticles = function(callback) {
  
  // equivalent of CouchDB https://<server>:<port>/articles/_design/matching/_view/byts?limit=100&reduce=false&include_docs=true&descending=true&startkey=["readz"]&endkey=["read"]
  // N.B. when doing doing descending=true with startkey/endkey, you must also swap startkey/endkey(!)
  articles.view('matching','byts', { limit: 100, reduce: false, include_docs: true, descending:true,  startkey:["read"+"z"],endkey: ["read"]}, function(err,data) {
    if(!err) {
      var retval=[];
      for(var i in data.rows) {
        retval.push(data.rows[i].doc);
      }
    }

    callback(err,retval);
  })
}

// fetch starred articles from couchdb
var starredArticles = function(callback) {
  
  // equivalent of CouchDB https://<server>:<port>/articles/_design/matching/_view/byts?limit=100&reduce=false&include_docs=true&descending=true&startkey=["starredz"]&endkey=["starred"]
  // N.B. when doing doing descending=true with startkey/endkey, you must also swap startkey/endkey(!)
  articles.view('matching','byts', { limit: 100, reduce: false, include_docs: true, descending:true, startkey:["starred"+"z"],endkey: ["starred"]}, function(err,data) {
    if(!err) {
      var retval=[];
      for(var i in data.rows) {
        retval.push(data.rows[i].doc);
      }
    }

    callback(err,retval);
  })
}

// get counts of read/unread/starred articles
var stats = function(callback) {
  // equivalent of CouchDB https://<server>:<port>/articles/_design/matching/_view/byts?group_level=1
  articles.view('matching','byts', { group_level: 1}, function(err,data) {
    var retval={}
    if(!err) {
      for(var i in data.rows) {
        retval[data.rows[i].key[0]] = data.rows[i].value;
      }
    }
    callback(err,retval);
  })
}

// mark an article as read
var markRead = function(id, callback) {
  
  // fetch the article
  articles.get(id, function(err, doc) {
    if (!err) {
      // mark its read flag as true
      if(typeof doc.read == "undefined" || doc.read==false) {
        doc.read=true;
      
        // write it back
        articles.insert(doc,function(err,data) {

        });
        
        callback(doc);
      } else {
        callback(doc);
      }
    } else {
      callback(false)
    }

  });
}

// mark an article as starred
var star = function(id, callback) {
  
  // fetch the article
  articles.get(id, function(err, doc) {
    if (!err) {
      // mark its star flag as true
      if(typeof doc.starred == "undefined" || doc.starred==false) {
        doc.starred=true;

        // write it back
        articles.insert(doc,function(err,data) {

        });
        callback(doc);
      } else {
        callback(doc);
      }

    } else {
      callback(false)
    }

  });
}

// mark an article as read
var unstar = function(id, callback) {
  
  // fetch the article
  articles.get(id, function(err, doc) {
    if (!err) {
      // mark its star flag as true
      if(typeof doc.starred == "undefined" || doc.starred==true) {
        doc.starred=false;

        // write it back
        articles.insert(doc,function(err,data) {

        });
        callback(doc);
      } else {
        callback(doc);
      }

    } else {
      callback(false)
    }

  });
}

module.exports = {
  unreadArticles: unreadArticles,
  readArticles: readArticles,
  starredArticles: starredArticles,
  markRead: markRead,
  star: star,
  unstar: unstar,
  stats: stats
}
