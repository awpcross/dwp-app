angular.module('starter.services', ['dpd', 'appconfig'])

.service('AppConfigService', ['dpd', 'DataService', '$q', function(dpd, DataService, $q) {

	this.appLabelsForSection = function(section, lang) {
		// returns the applabels for a section (uses Dataservice, same cache rules apply)
		var applabels;
		var filteredApplabels = [];
		var filteredValues = 0;

		console.log('AppConfigService.appLabelsForSection('+section+','+lang+') | processing ');
		
		DataService.getBackendData(dpd, 'applabels', 'live').success(function(response) {
			console.log('AppConfigService.appLabelsForSection | backend data query returned ' + response.length + ' rows');
			applabels = response;
			for (var key in applabels){
				if ( applabels[key].section == section && applabels[key].lang == lang) {
					filteredApplabels[applabels[key].key] = applabels[key];
					filteredValues++;
				}
			}
			console.log('AppConfigService.appLabelsForSection | '+filteredValues+' item(s) for section');
		}).error(function(error) {
			console.log('AppConfigService.appLabelsForSection | An error occured : ' + error);
			applabels = {};
		})

	return filteredApplabels;
	}

	this.appContentsForSection = function(section, lang) {
	// returns the appcontents for a section (uses Dataservice, same cache rules apply)
		var appcontents;
		var filteredAppcontents = [];
		var filteredValues = 0;

		console.log('AppConfigService.appLabelsForSection('+section+','+lang+') | processing ');
		
		DataService.getBackendData(dpd, 'appcontents', 'live').success(function(response) {
			console.log('AppConfigService.appLabelsForSection | backend data query returned ' + response.length + ' rows');
			appcontents = response;
			for (var key in appcontents){
				if ( appcontents[key].section == section && appcontents[key].lang == lang) {
					filteredAppcontents[appcontents[key].key] = appcontents[key];
					filteredValues++;
				}
			}
			console.log('AppConfigService.appLabelsForSection | '+filteredValues+' item(s) for section');
		}).error(function(error) {
			console.log('AppConfigService.appLabelsForSection | An error occured : ' + error);
			appcontents = {};
		})

	return filteredAppcontents;
	}
}])

.service('DataService', ['dpd', '$q', function(dpd, $q) {

	// dynamic notation for dpd object, it rocks!
	//console.log(dpd["applabels"]);

	var cacheKeyPrefix 				= 'data-cache-';
	var cachedCollectionsIndexKey 	= 'data-cache-index';
	var collDataCacheKey = '';
	var collTsCacheKey  = '';

	addDataToCache = function( collection, ts, data ) {
	
		var collDataCacheKey = cacheKeyPrefix + collection + '_data';
		var collTsCacheKey  = cacheKeyPrefix + 	collection + '_datats';

		console.log('DataService::addDataToCache() | caching data for collection (' + collection + ') with key \''+collDataCacheKey+'\', ts : ' + ts);		
		window.localStorage.setItem( collDataCacheKey, JSON.stringify( data ) );
		window.localStorage.setItem( collTsCacheKey, ts );
		
		cachedCollectionsFromCache = window.localStorage.getItem( cachedCollectionsIndexKey );
		cachedCollections = JSON.parse(cachedCollectionsFromCache);

		if (cachedCollections==null) {
			cachedCollections = [];
		} 
		if (cachedCollections.indexOf(collection) < 0) {
			cachedCollections.push(collection);
		}
		window.localStorage.setItem( cachedCollectionsIndexKey, JSON.stringify(cachedCollections) )
		console.log('DataService::addDataToCache() | adding collection (' + collection + ') to localStorage ' + cachedCollectionsIndexKey + ' item');
		console.log(JSON.stringify(cachedCollections));

		console.log('DataService::addDataToCache() | done caching data for collection (' + collection + ')');		
		
	}

	this.getBackendCacheStatus = function() {
		var str = '';
		var i = 0;
		console.log('DataService::getBackendCacheStatus() | starting');		
		
		var cachedCollectionsFromCache = window.localStorage.getItem( cachedCollectionsIndexKey );
		console.log('cachedCollectionsFromCache');
		console.log(cachedCollectionsFromCache);
		
		cachedCollections = JSON.parse(cachedCollectionsFromCache);
		
		for (var key in cachedCollections){
			if (i!=0) str += ', ';
			str = str + cachedCollections[key];
			i++;
		}
		console.log('DataService::getBackendCacheStatus() | done');		
		return str;
	}

	this.cleanBackendCacheData = function() {
		console.log('DataService::cleanBackendCacheData() | cleaning cache data for all collections');		
		//localStorage.clear(); //for dev only
		
		cachedCollectionsFromCache = window.localStorage.getItem( cachedCollectionsIndexKey );
		cachedCollections = JSON.parse(cachedCollectionsFromCache);
		
		for (var key in cachedCollections){
			console.log(cachedCollections[key]);
			collDataCacheKey = cacheKeyPrefix + cachedCollections[key] + '_data';
			collTsCacheKey  = cacheKeyPrefix + 	cachedCollections[key] + '_datats';
			localStorage.removeItem(collDataCacheKey);
			localStorage.removeItem(collTsCacheKey);
		}
		window.localStorage.removeItem(cachedCollectionsIndexKey);
		console.log('DataService::cleanBackendCacheData() | cache cleaned');		
	}
	
	this.getDevBackendData = function(collection) {
		var str = '';
		var obj = {};
		var deferred = $q.defer();
        var promise = deferred.promise;
		
		switch (collection) {
		
			case 'test' : 
				str = '[{"name":"testname","value":"testvalue"}]';
				break;
			case 'users' : 
				str = '[{"nickname":"Bart Simpson","picture":false,"username":"bart@gmail.com","score":5000,"activated":false,"id":"77876edeb634e8af"}]';
				break;
			case 'players' : 
				str = '[{"name":"testname","value":"testvalue"}]';
				break;
			case 'applabels' : 
				str = '[{"section":"first","key":"onekey","orderno":1,"text":"first text label","id":"dfff00ade950281f"}]';					
				break;
			case 'appcontents' : 
				str = '[{"section":"first","key":"onekey","orderno":1,"text":"first text label","id":"dfff00ade950281f"}]';					
				break;
			default:
				break;
		}
		obj = JSON.parse(str);
		deferred.resolve(obj);

		return obj;
		};

	this.getLocalBackendData = function(collection) {

		var str;
		var deferred = $q.defer();
        var promise = deferred.promise;
		
		// check strings with http://json.parser.online.fr/
		switch (collection) {
			case 'test' : 
				str = '[{"name":"testname","value":"testvalue"}]';
				break;
			case 'users' : 
				str = '';
				break;
			case 'scores' : 
				str = '[{"nickname":"Impossible d\'afficher les scores"}]';
				break;
			case 'newsecom' : 
				str = '[{"headerText":"Conférence e-commerce","titleText":"Total Retail: du digital à la boutique.... et du digital en boutique! ","headlineText":"","articleText":"Comment faire évoluer votre plateforme digitale, vos points de vente, mieux connaître vos clients et créer votre stratégie de marketing relationnel. <br/>Intervenant : Pascal Escarment","timestamp":1429599600000,"type":"presenter_podium","id":"19651b1aada4984d"},{"titleText":"Conférence Big Data","headlineText":"","headerText":"Conférence Big Data","type":"presenter_podium","timestamp":1429597980000,"articleText":"Le Big Data à l\'assaut des zones de confort technique. Dois-je y aller? Mais surtout quel chemin emprunter? <br/>Intervenant : Charles Parat","id":"314f6d475fd3e8a8"},{"headerText":"Retrouvez-nous sur notre stand (B12)","titleText":"VENEZ DÉCOUVRIR CROSS AU SALON SITB ET ECOM","headlineText":"","articleText":" Expérimentez les solutions Cross comme vous ne l\'avez jamais fait auparavant.<br/> Venez vivre l\'expérience Web2Store et Big Data avec Cross, qui sera présent avec deux conférences et un stand au salon SITB et eCOM du mardi 21 au mercredi 22 avril 2015.","timestamp":1428305400000,"type":"information","id":"7a7bc777222058d5"}]';
				break;
			case 'newscross' : 
				str = '[{"headerText":"Retrouvez-nous sur notre stand (B12)","titleText":"VENEZ DÉCOUVRIR CROSS AU SALON SITB ET ECOM","headlineText":"","articleText":" Expérimentez les solutions Cross comme vous ne l\'avez jamais fait auparavant.<br/> Venez vivre l\'expérience Web2Store et Big Data avec Cross, qui sera présent avec deux conférences et un stand au salon SITB et eCOM du mardi 21 au mercredi 22 avril 2015.","timestamp":1428305400000,"type":"information","id":"7a7bc777222058d5"}]';
				break;			case 'applabels' : 
				str = '[{"section":"first","key":"onekey","orderno":1,"text":"first text label","id":"dfff00ade950281f"}]';					
				break;
			case 'appcontents' : 
				str = '[{"section":"first","key":"onekey","orderno":1,"text":"first text label","id":"dfff00ade950281f"}]';					
				break;
			case 'welcomecontents' : 
				str = '[{"content":"Bienvenue dans le \'Digital Watch Project\'","info":"welcome / slide 1 / item 1","viewid":"10","orderno":1,"subviewid":"1","tag":"h3","id":"228c1f5a8bb97951"},{"content":"Jouez avec Cross... et gagnez un prix mystère!","info":"welcome / slide 1 / item 2","viewid":"10","orderno":2,"subviewid":"1","tag":"p","id":"7756431f06fd5ac8"},{"content":"Cross vous propose un jeu de piste qui s\'appuie sur la technologie iBeacon. Nous avons placé ces petites balises dans divers lieux.","info":"welcome / slide 1 / item 3","viewid":"10","orderno":3,"subviewid":"1","tag":"p","id":"a0d397215f70d897"},{"viewid":10,"subviewid":"1","orderno":4,"tag":"p","content":"Lorsque que vous passez à proximité de l\'une d\'elle, vous activez un trophée qui vous crédite des points. De nombreux lots sont à gagner et le joueur au score le plus élevé remportera le premier prix.","info":"","id":"15815c055dbfcb2c"},{"viewid":10,"subviewid":"2","orderno":5,"tag":"h3","content":"1er indice : elle n\'a pas d\'aiguilles","info":"welcome / slide 2 / item 1","id":"05afc186f9c89acd"},{"viewid":10,"subviewid":"2","orderno":6,"tag":"p","content":"Enregistrez-vous dans l\'application (500 points)","info":"welcome / slide 2 / item 2","id":"48d9c5fc928208b5"},{"viewid":10,"subviewid":"2","orderno":7,"tag":"p","content":"Participez à nos conférences (4000 points / conférence)","info":"welcome / slide 2 / item 3","id":"98dc963906e6c913"},{"orderno":8,"content":"Le jour du salon SITB eCOM, rendez-nous visite sur notre stand B12 (1000 points)","viewid":0,"id":"3acc66df79beb9a9"},{"viewid":10,"subviewid":"2","orderno":9,"tag":"p","content":"2ème indice : elle ne fait pas que donner l\'heure","info":"","id":"1463d4fa1f578a3e"},{"viewid":10,"subviewid":"3","orderno":10,"tag":"p","content":"Faites un \'check-out\' sur notre stand et pulvérisez votre score. (nombre de points aléatoire)","id":"ead664be205ff8f0"},{"viewid":10,"subviewid":"3","orderno":11,"tag":"p","content":"Le mercredi 22 avril à 18:00, un tirage au sort vous attribuera des points supplémentaires","info":"","id":"147eb4b378e4e981"},{"orderno":12,"code":"","content":"Soyez le premier et raflez la mise!","id":"6e727decaf95791c"},{"orderno":13,"content":"3ème indice : elle parle avec votre smartphone","id":"f19cb9233bb2c8d2"},{"orderno":14,"content":"Vous avez trouvé? Alors BONNE CHANCE !","id":"e18c6884420a18c9"},{"orderno":14,"content":"N\'attendez plus, lancez-vous dans la recherche des ces trophées en vivant une expérience aussi ludique qu\'instructive. Sans oublier le superbe prix qui n\'attend plus que vous.","viewid":0,"id":"d2466fe591d9db5d"},{"orderno":15,"content":"Commencez dès à présent à vous enregistrer dans l\'application et laissez-vous guider jusqu\'au but.","viewid":0,"id":"df868f0f693489e4"}]';					
				break;
		}
		console.log(str);
		
		obj = JSON.parse(str);
		deferred.resolve(obj);

		promise.success = function(fn) {
			promise.then(fn);
			return promise;
		}

		promise.error = function(fn) {
			promise.then(null, fn);
			return promise;
		}
		
		return promise;
		};

	this.getCachedBackendData = function(collection) {
		var dta = {};
		var cacheExpiry;

		if ( collection != null || collection == '') {
			var cacheKey = cacheKeyPrefix + collection;
		} else {
			cacheKey = 'CACHEERR_' + currentTS;
		}
		console.log('DataService::getCachedBackendData() | INFO Will use cacheKey : '+cacheKey);
		cachedExpiry = parseInt( window.localStorage.getItem( cacheKey + '_cachets') ); 
		if ( !isNaN( cachedExpiry ) ) {
			cacheExpiry = cachedExpiry + cacheLiveTime;		
		} else {
			cacheExpiry = 0;
		}
		
		var currentTS = new Date().getTime();

		console.log('DataService::getCachedBackendData() | INFO cache expiry : ' + cacheExpiry + ' (current : ' + currentTS + ')' );
		if (cacheExpiry != null || cacheExpiry != '') {
			var tmpDta = window.localStorage.getItem( cacheKey + '_data' );
			if ( tmpDta != null || tmpDta == '') {
				dta = JSON.parse(tmpDta);
			} else {
				console.log('DataService::getCachedBackendData() | ERROR, no cached data');
				return null;
			}		
		} else {
			console.log('DataService::getCachedBackendData() | ERROR, no cached data');
			return null;
		}
		
		//console.log('DataService::getCachedBackendData() | returning data : ' + dta);
		console.log('DataService::getCachedBackendData() | returning data : ' + dta);
		return dta;
	}	

	this.getLiveBackendData = function(collection, collObj, collQuery, cacheLiveTime) { 

		var deferred = $q.defer();
        var promise = deferred.promise;
		var currentTS = new Date().getTime();
		var cacheExpiry;


		if ( collObj == null ) {
			console.log('DataService::getLiveBackendData() | ERROR data collection does not exist');
			// TODO manage error msg &  return
		} else {
			console.log('DataService::getLiveBackendData() | INFO Working with collection : '+collection);

			
			if ( collection != null || collection == '') {
				var cacheKey = cacheKeyPrefix + collection;
			} else {
				cacheKey = 'CACHEERR_' + currentTS;
			}
			console.log('DataService::getLiveBackendData() | INFO Will use cacheKey : '+cacheKey);
			cachedExpiry = parseInt( window.localStorage.getItem( cacheKey + '_datats') ); 
			if ( !isNaN( cachedExpiry ) ) {
				cacheExpiry = cachedExpiry + cacheLiveTime;		
			} else {
				cacheExpiry = 0;
			}
			console.log('DataService::getLiveBackendData() | INFO Checking cache expiry, currentTS   : '+currentTS + '(' + new Date(currentTS) + ')');
			console.log('DataService::getLiveBackendData() | INFO Checking cache expiry, cacheExpiry : ' + cacheExpiry+ '(' + new Date(cacheExpiry) + ')');
			console.log('DataService::getLiveBackendData() | INFO Checking cache expiry, needs refresh : ' + (currentTS > cacheExpiry) );
			
			if ( currentTS > cacheExpiry  ) {
				console.log('DataService::getLiveBackendData() | INFO cache expired, requesting live data');
				
				collObj.get(collQuery, function(result, error){
				
				if (error != 200) { // error contains HTTP response code
					console.log('DataService::getLiveBackendData() | async | ERROR an error occured processing the DB request, probably a malformed query (error code : ' + error + ')');
					deferred.reject('ERROR processing the DB request, probably a malformed query (error code : ' + error + ')')
					// TODO return value null ? empty
					//return null; return unnecessary promise is rejected
				} else {

				if ( result != null ) {
					console.log('DataService::getLiveBackendData() | async |  INFO query sucessfully returned ' + result.length + ' row(s)');
					//console.log(result);
					//console.log(JSON.stringify( result ));
					var currentTS = new Date().getTime();
					console.log('DataService::getLiveBackendData() | async |  INFO caching response with ts : '+ currentTS);
					this.addDataToCache(collection, currentTS, result);
					
					deferred.resolve(result);
				} else {
					// TODO ---test
					console.log('DataService::getLiveBackendData() | async |  ERROR, cannot return live data (response is null), leaving cache unchanged ', response);
					deferred.reject('ERROR result is null');
					//return null; return unnecessary promise is rejected
				}
				
				}
			});
		} else {
			// TODO ---test
			console.log('DataService::getLiveBackendData() | cache is valid, returning cached data');
			response = this.getCachedBackendData(collection);
			deferred.resolve(response);
		}

			
		}
		
		promise.success = function(fn) {
			promise.then(fn);
			return promise;
		}

		promise.error = function(fn) {
			promise.then(null, fn);
			return promise;
		}
		return promise;

	};

	this.getBackendData = function(dpd, collection, mode) {
		console.log('DataService::getBackendData(' + mode + ') | processing ...');

		var dta = {};
		var collObj;
		var collQuery = '';

				
			// getting a pointer on the dpd collection
			//'test','users', 'applabels', 'welcomecontents', 'trophies', 'trophiesmatched', 'newsecom', 'newscross', 'trophycontents', 'prereqcontents'
			switch (collection) {
				case 'test' : 
					collObj = dpd.test;
					cacheLiveTime = 0;
					break;
				case 'users' : 
					collObj = dpd.users;
					collQuery = { $sort: {id: 1}};
					cacheLiveTime = 0;					
					break;
				case 'scores' : 
					collObj = dpd.users;
					collQuery = { $sort: {score: -1},  $limit: 30};
					cacheLiveTime = 900000;					
					break;
				case 'applabels' : 
					collObj = dpd.applabels;
					collQuery = { $sort: {orderno: 1}};
					cacheLiveTime = 10800000;					
					break;
				case 'appcontents' : 
					collObj = dpd.appcontents;
					collQuery = { $sort: {orderno: 1}};
					cacheLiveTime = 10800000;					
					break;
				case 'newsecom' : 
					collObj = dpd.newsecom;
					collQuery = { $sort: {timestamp: -1}};
					cacheLiveTime = 900000;					
					break;
				case 'newscross' : 
					collObj = dpd.newscross;
					collQuery = { $sort: {timestamp: -1}};
					cacheLiveTime = 900000;					
					break;
				case 'welcomecontents' : 
					collObj = dpd.welcomecontents;
					collQuery = { $sort: {orderno: 1}};
					cacheLiveTime = 10800000;
					break;
				default : 
					collObj = null;
					break;
			}
			
		if ( collObj != null ) {		

			// getting data in requested mode
			switch (mode) {
				case 'live':
					return this.getLiveBackendData(collection, collObj, collQuery, cacheLiveTime);
				break;
				
				case 'cache' : 
					return this.getCachedBackendData(collection);
				break;

				case 'local' : 
					console.log('call');
					console.log(this.getLocalBackendData(collection));
					return this.getLocalBackendData(collection);
					console.log('done call');
				break;

				case 'dev' :
				default :
					dta =  this.getDevBackendData(collection);
					break;
			}
		} else {
			console.log('DataService::getBackendData(' + mode + ') | ERROR collection "'+ colection+'" does not exits in backend ');
			dta = null;
		}


		console.log('DataService::getBackendData(' + mode + ') | done.');
		return dta;
	}	

}])

.service('LoginService', ['dpd', '$q', 'ENV', function(dpd, $q, env) {
    
    console.log('LoginService | starting... ');
    return {
        loginUser: function(name, pw, dpd) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            
            username = 'bart@gmail.com';
            password = 'bart';
            
            console.log('LoginService | using appconfig.ENV : "' + env +'"');
            if ( env == 'dev-nobackend') {
                console.log('LoginService | skipping auth (no uid available...)');
                deferred.resolve('Welcome ' + username + '!');

            } else if ( env == 'dev-local-backend' ) {
            
            
            console.log('LoginService | auth with bart@gmail.com');
            
            dpd.users.exec('login', { username: username, password: password }).success(function(session) {
                  console.log('success ! Bart logged in');
                  console.log('Sucess logged in : ' + username + ' (' + session.uid + ')!');    

                console.log('checking current user start');
                console.log('persisting auth state');
                localStorage.setItem("user_auth_id", session.uid);
                console.log('set user_auth_id : ', localStorage.getItem("user_auth_id") );

              dpd.users.get('me').success(function(session) {
                  console.log('me :: success ! Bart logged in');
                  console.log('session', session);
                  console.log('me :: Sucess logged in : ' + session.nickname + ' (' + session.id + ')!'); 
                  deferred.resolve('Welcome ' + name + ' (' + session.uid + ')!'); 
              }).error(function(error) {
                  console.log('me::ERROR : ' + error.message, error);
                  console.log('me::ERROR : please check user : ' + username + ' exists in DB.');
                  deferred.reject('Wrong credentials.');
              });

              console.log('checking current user done.');

              deferred.resolve('Welcome ' + name + ' (' + session.uid + ')!'); 

                  }).error(function(error) {
                  console.log('ERROR : ' + error.message, error);
                  console.log('ERROR : please check user : ' + username + ' exists in DB.');
                  deferred.reject('Wrong credentials.');
              });
              
              

            } else {
            
            console.log('LoginService | calling deployd service (' + name + ' / ' + pw + ')... ');
            dpd.users.exec('login', { username: name, password: pw }).success(function(session) {
                  console.log('success !');

                console.log('persisting auth state');
                localStorage.setItem("user_auth_id", session.uid);
                console.log('set user_auth_id : ', localStorage.getItem("user_auth_id") );

                deferred.resolve('Welcome ' + name + ' !');         
            }).error(function(error) {
                  console.log('error : ' + error.message, error);
                  deferred.reject('Wrong credentials.');
            });

            console.log('LoginService | done deployd ... ');
            }

            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }

            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    }
    console.log('LoginService | done. ') ;
    
}])

// TODO : Ajouter deux trophees ( app telechargee et compte cree) dans la table trophiesmatched au moment de la creation de l user et mettre le bon totalscore dans la table users
.service('RegisterUserService', ['dpd', '$q', 'ENV', function(dpd, $q, env) {
    
    console.log('RegisterUserService | starting... ');
    return {
        registerUser: function(newusername, newpassword, newnickname, dpd) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            username = 'bart@gmail.com';
            password = 'bart';
            nickname = 'Bart Simpson'; 
            score = 1500;
            
            console.log('RegisterUserService | using appconfig.ENV : "' + env +'"');
            if ( env == 'dev-nobackend') {
                console.log('RegisterUserService | skipping register (no user created...)');
                deferred.resolve('Created ' + name + '!');

            } else if ( env == 'dev-local-backend' ) {
            
            
            console.log('RegisterUserService | registering bart@gmail.com (' + username + ' / ' + password + ' / ' + nickname + ')');
            
            dpd.users.post({ username: username, password: password, nickname: nickname, score: score, picture:false, acivated:false }).success(function(session) {
                  console.log('success ! user created');
                  console.log('Sucess created user : ' + username + ' (' + session.uid + ')!'); 
                  deferred.resolve('Created ' + name + ' (' + session.uid + ')!'); 
              }).error(function(error) {
                  console.log('ERROR : ' + error.message, error);
                  console.log('ERROR : please check could not create : ' + username + ' in DB.');
                  deferred.reject('Wrong credentials.');
              });

            } else {    
            console.log('RegisterUserService | calling deployd service (dpd.users.login)... ');
            
            dpd.users.post({ username: newusername, password: newpassword, nickname: newnickname, score: score, picture:false }).success(function(session) {
                  console.log('success ! user created');
                  console.log('Sucess created user : ' + session.username + ' (' + session.id + ')!'); 
                  deferred.resolve('Created ' + session.username + ' (' + session.id + ')!'); 
              }).error(function(error) {
                  console.log('ERROR : ' + error.message, error);
                  console.log('ERROR : please check could not create : ' + username + ' in DB.');
                  deferred.reject('Wrong credentials.');
              });

            console.log('RegisterUserService | done deployd ... ');
            }

            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }

            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    }
    console.log('RegisterUserService | done. ') ;
    
}])

.service('ProfileService', ['dpd', '$q', 'ENV', function(dpd, $q, env) {
    console.log('ProfileService | starting... ');
    return {
    
        getUserProfile: function(uid, dpd) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            username = 'bart@gmail.com';
            password = 'bart';
            nickname = 'Bart Simpson'; 
            score = 1500;
            
            console.log('ProfileService | using appconfig.ENV : "' + env +'"');
            if ( env == 'dev-nobackend') {
                console.log('ProfileService | skipping register (no user created...)');
                deferred.resolve('Created ' + name + '!');

            } else if ( env == 'dev-local-backend' ) {
            
            
            console.log('ProfileService | getting info on ' + uid );
            
              dpd.users.get(uid).success(function(session) {
                  console.log('me :: success ! A user is logged in');
                  console.log('session', session);
                  console.log('me :: Sucess Sucess user is already logged in : ' + session.nickname + ' (' + session.id + ')!'); 
                  //deferred.resolve('Welcome ' + session.nickname + ' (' + session.id + ')!'); 
                  return(session);

              }).error(function(error) {
                  console.log('me::ERROR : ' + error.message, error);
                  console.log('me::ERROR : please check user : ' + username + ' exists in DB.');
                  deferred.reject('Wrong credentials.');
              });

            } else {    
            console.log('ProfileService | calling deployd service (dpd.users.get(me))... ');
            
              dpd.users.get(uid).success(function(session) {
        
        
                  console.log('me :: success ! A user is logged in');
                  console.log('session', session);
                  console.log('me :: Sucess logged in : ' + session.nickname + ' (' + session.id + ')!'); 
                  //deferred.resolve('Welcome ' + session.nickname + ' (' + session.id + ')!');
                  deferred.resolve(session);
                  return(session);
                  
              }).error(function(error) {
                  console.log('me::ERROR : ' + error.message, error);
                  console.log('me::ERROR : no user logged in.');
                  deferred.reject('No user logged in.');
              });

            
            console.log('ProfileService | done deployd ... ');
            }

            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }

            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    
    };
    
    
    console.log('ProfileService | done. ') ;
    
}])

.factory('ScoreService', function($http,dpd) {


  var promise;
  var ScoreService = {
    getScores: function() {
      if ( !promise ) {
        // $http returns a promise, which has a then function, which also returns a promise
        promise = $http.get('https://digitalwatchproject.cross-systems.ch/users').then(function (response) {
          // The then function here is an opportunity to modify the response
          // TODO Penser a la mise a jour du score
          console.log("************** RESPONSE : "+response.data);
          // The return value gets picked up by the then in the controller.
          return response.data;
        });
      }
      // Return the promise to the controller
      return promise;
    }
  };
  return ScoreService;
})

/* Beacons/Trophies Factory */
.factory('Trophies', function($http) {
  // TODO : get all region from a resource that returns a JSON array
   /*
   var beaconRegions = [{
        id : 'eac708b7e5f508e1',
        identifier: 'BienvenueAuSalon',
        name: 'Bienvenue Au Salon',
        uuid:'085AED38-4155-4A99-9C4B-372CE7AD6BDF',
        major: 400,
        minor: 1,
        orderNo:1,
        points: 1000,
        description : 'ND : Vous avez débloqué le trophée : App téléchargée !',
        nextStep : 'Créez vous un compte!',
        beaconColor: 'red',
        maxCount:1,
        delay:3600,
        startDate:1427984918000,
        endDate:1430438399000,
        isActive : false
    },
    {
        id : 'ebae93ac8b78cbce',
        identifier: 'RencontreAvecNosIntervenants',
        name: 'Rencontre Avec Nos Intervenants',
        uuid:'085AED38-4155-4A99-9C4B-372CE7AD6BDF',
        major: 600,
        minor: 1,
        orderNo:2,
        points: 1500,
        description : 'ND : Vous avez débloqué le trophée : Rencontre avec nos intervenants',
        nextStep : 'Allez vite à l apero reseautage',
        beaconColor: 'yellow',
        maxCount:1,
        delay:3600,
        startDate:1427984918000,
        endDate:1430438399000,
        isActive : false
    },
    {
        id : '22334cdaa20578a3',
        identifier: 'ZoneApero',
        name: 'Zone Apero',
        uuid:'085AED38-4155-4A99-9C4B-372CE7AD6BDF',
        major: 500,
        minor: 1,
        orderNo:3,
        points: 450,
        description : 'ND : Vous avez débloqué le trophée : Apéro Réseautage',
        nextStep : 'Allez vite a la conf',
        beaconColor: 'yellow',
        maxCount:1,
        delay:3600,
        startDate:1427984918000,
        endDate:1430438399000,
        isActive : false
    },
    {
        id : '8c1cc8ed6a6b7bbe',
        identifier: 'ZoneConf',
        name: 'Zone Conf',
        uuid:'085AED38-4155-4A99-9C4B-372CE7AD6BDF',
        major: 500,
        minor: 1,
        orderNo:3,
        points: 3500,
        description : 'ND : Vous avez débloqué le trophée : Suivi de conférence BIG DATA',
        nextStep : 'Allez vite au stand',
        beaconColor: 'blue',
        maxCount:1,
        delay:3600,
        startDate:1427984918000,
        endDate:1430438399000,
        isActive : true
    },
    {
        id : 'aebda58efdbf3946',
        identifier: 'ZoneStand',
        name: 'Zone Stand',
        uuid:'085AED38-4155-4A99-9C4B-372CE7AD6BDF',
        major: 700,
        minor: 1,
        orderNo:4,
        points: 750,
        description : 'ND : Vous avez débloqué le trophée : Visite de notre stand (B12)',
        nextStep : 'C etait le dernier trophée. Revenez-nous voir au stand',
        beaconColor: 'black',
        maxCount:1,
        delay:3600,
        startDate:1427984918000,
        endDate:1430438399000,
        isActive : true
    }];
    
    // TODO : get all Granted trophies from a resource that returns a JSON array
    var listGrantedTrophies = [{
          trophyid : 'eac708b7e5f508e1',
          userid :'77876edeb634e8af',
          timestamp :1427984918000,
        },
        {
          trophyid : 'ebae93ac8b78cbce',
          userid :'77876edeb634e8af',
          timestamp :1427984922000,
        },
        {
          trophyid : '22334cdaa20578a3',
          userid :'77876edeb634e8af',
          timestamp :1427984922000,
        }
    ];
    */
     var beaconRegions = [];
    var listGrantedTrophies = [];
    var listInfoGrantedTrophies = [];

    var  promise = [];
    var isAndroid = ionic.Platform.isAndroid();


  // Get a specific trophy from regionState
  getFromRegion  = function($scope,regionState) {
    console.log('getFromRegion | start!');
    var  trophy = {};
    // Number of flagged of the trophy
    //var  nbFlagged = 0;
    for (var i = 0; i < beaconRegions.length; i++) {
        if (beaconRegions[i].identifier === regionState.identifier) {
          console.log('getFromRegion | FOUND');
          trophy = beaconRegions[i];
          // nbFlagged += 1;
        }
      }
      // trophy.nbFlagged = nbFlagged;
      //alert(trophy.nbFlagged);
      return trophy;
  }

  // Get Trophies Json
  getTrophies = function($scope,dpd) {
    console.log('******************* | START  getTrophies!');
    var promise1;
    promise1 = dpd.trophies.get().then( function (response) {
      console.log(JSON.stringify(response.data));
       return response.data;
    });
    // Return the promise to the controller
    return promise1;
  }

    // Get Matched Trophies Json
  getGrantedTrophies = function($scope,dpd) {

    console.log('******************* | START  getTrophies Granted');
    var promise2;
    // Get Granted Trophies for the authentified user
    promise2 = dpd.trophiesmatched.get({userid:localStorage.getItem("user_auth_id")}).then( function (response) {
      console.log("INIT : Granted TROPHIES: "+JSON.stringify(response.data));
       return response.data;
    });
    // Return the promise to the controller
    return promise2;
  }


  //Get list of granted trophy
  getListGrantedTrophies = function($scope) {
    // reSet beaconRegions for ALL other functions
    listGrantedTrophies = $scope.listGrantedTrophies;
    // TODO : voir pourquoi necessaire de redefinir le scope
    beaconRegions = $scope.trophies;
    console.log('getListGrantedTrophies | start!');
    for (var i = 0; i < listGrantedTrophies.length; i++) {
        var bRegionId = listGrantedTrophies[i].trophyid;
        // Loop on regions - should be optimized
        //console.log("BOUCLE : "+ i + " bregionId : " + bRegionId);
        for (var j = 0; j < beaconRegions.length; j++) {
          //console.log("j : "+ j)
         if (beaconRegions[j].id === bRegionId) {
            listInfoGrantedTrophies.push(beaconRegions[j]);
           // console.log("ADD : "+ j + JSON.stringify(beaconRegions[j]));
        }
      }
    }
        console.log('getListGrantedTrophies | PASENDUR' + JSON.stringify(listInfoGrantedTrophies));
    // listInfoGrantedTrophies = JSON.stringify(listInfoGrantedTrophies);
    // listInfoGrantedTrophies = [{"name":"Zone Apero","description":"Apéritifs réseautage","points":500,"maxCount":1,"beaconColor":"yellow","endDate":1430438399000,"startDate":1427984918000,"nextStep":"Allez rencontrez nos intervenants","orderNo":3,"isActive":false,"uuid":"085AED38-4155-4A99-9C4B-372CE7AD6BDF","major":11,"minor":1,"identifier":"ZoneApero","delay":3600,"id":"8c1cc8ed6a6b7bbe"},{"name":"Rencontre Avec Nos Intervenants","description":" Rencontre avec nos intervenants","points":400,"maxCount":1,"endDate":1430438399000,"startDate":1427984918000,"nextStep":"Allez vite à l apero reseautage","orderNo":2,"isActive":false,"beaconColor":"yellow","delay":3600,"identifier":"RencontreAvecNosIntervenants","uuid":"085AED38-4155-4A99-9C4B-372CE7AD6BDF","major":12,"minor":1,"id":"22334cdaa20578a3"},{"name":"Bienvenue Au Salon","points":300,"description":"App téléchargée !","maxCount":1,"beaconColor":"red","endDate":1430438399000,"startDate":1427984918000,"nextStep":"Créez vous un compte!","orderNo":1,"isActive":false,"uuid":"085AED38-4155-4A99-9C4B-372CE7AD6BDF","major":10,"minor":1,"identifier":"BienvenueAuSalon","delay":3600,"id":"eac708b7e5f508e1"},{"name":"Zone Stand","description":"Vous avez débloqué le trophée : Visite de notre stand (B12)","points":2000,"maxCount":2,"endDate":1430438399000,"startDate":1427984918000,"nextStep":"C etait le dernier trophée. Revenez-nous voir au stand","orderNo":5,"isActive":true,"beaconColor":"black","delay":3600,"identifier":"ZoneStand","uuid":"085AED38-4155-4A99-9C4B-372CE7AD6BDF","major":700,"minor":1,"id":"ebae93ac8b78cbce"},{"name":"Zone Conf","description":"Vous avez débloqué le trophée : Suivi de conférence BIG DATA","points":1000,"maxCount":1,"endDate":1430438399000,"startDate":1427984918000,"nextStep":"Allez vite au stand","orderNo":4,"isActive":true,"beaconColor":"blue","delay":3600,"identifier":"ZoneConf","uuid":"085AED38-4155-4A99-9C4B-372CE7AD6BDF","major":500,"minor":1,"id":"aebda58efdbf3946"},{"name":"Zone Conf","description":"Vous avez débloqué le trophée : Suivi de conférence BIG DATA","points":1000,"maxCount":1,"endDate":1430438399000,"startDate":1427984918000,"nextStep":"Allez vite au stand","orderNo":4,"isActive":true,"beaconColor":"blue","delay":3600,"identifier":"ZoneConf","uuid":"085AED38-4155-4A99-9C4B-372CE7AD6BDF","major":500,"minor":1,"id":"aebda58efdbf3946"}];
    console.log('******BEFORE ORDERING ******');
    listInfoGrantedTrophies = sortByKey(listInfoGrantedTrophies, 'orderNo');
    console.log('******AFTER ORDERING ******');
    return listInfoGrantedTrophies;
  }
    /*helper to sort Json*/
    sortByKey= function (array, key) {
        return array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        });
    }

    //Get Currents points
  getCurrentPoints = function($scope) {
    listGrantedTrophies = $scope.listGrantedTrophies;
    beaconRegions = $scope.trophies;
    console.log('getCurrentPoints | start!');
    var points = 0;
    for (var i = 0; i < listGrantedTrophies.length; i++) {
        var bRegionId = listGrantedTrophies[i].trophyid;
        // Loop on regions - should be optimized
        for (var j = 0; j < beaconRegions.length; j++) {
         if (beaconRegions[j].id === bRegionId) {
           points += beaconRegions[j].points;
        }
      }
    }
    return points;
  }

      //Get Currents points
  getNbMatch = function($scope,trophyid) {
    console.log('getNbMatch | start!'+ trophyid);
    listGrantedTrophies = $scope.listGrantedTrophies;
    var nbMatch = 0;
    for (var i = 0; i < listGrantedTrophies.length; i++) {
         if (listGrantedTrophies[i].trophyid === trophyid) {
           nbMatch += 1;
      }
    }
    console.log('getNbMatch | nbMatch' + nbMatch);
    console.log('getNbMatch | end!');
    return nbMatch;
  }

  // Get Matched Trophies Json
  checkIfDoublon = function($scope,trophyid,dpd) {
    console.log('******************* | START  checkIfDoublon' + localStorage.getItem("user_auth_id") +'- trophyid -' + trophyid);
    var promise3;
    // Get Granted Trophies for the authentified user
    promise3 = dpd.trophiesmatched.get({userid:localStorage.getItem("user_auth_id"),trophyid:trophyid}).then( function (response) {
      console.log("INIT : checkIfDoublon TROPHIES: "+JSON.stringify(response.data));
       return response.data.length;
    });
    // Return the promise to the controller
    return promise3;
  }

  // SetPoints
  setPoints = function ($scope,$trophy,dpd) {


    console.log("SETPOINTS : BEGIN" + JSON.stringify($trophy));
    var currentTS = new Date().getTime();
    // Set points
    dpd.trophiesmatched.post({ "timestamp" : currentTS, "trophyid":$trophy.id,"userid":localStorage.getItem("user_auth_id"),"points":$trophy.points}).success(function (result) {
            console.log("SETPOINTS : SUCESS" + JSON.stringify(result));
        }).error(function (err) {
           console.log("SETPOINTS : ERROR > " + JSON.stringify(err));
        }).finally(function () {
            console.log("SETPOINTS : FINALLY ");
        });
    // UPDATE GLOBAL SCORE
    dpd.users.put(localStorage.getItem("user_auth_id"),{"score":$scope.totalpoints}).success(function (result) {
            console.log("UPDATE GLOBALPOINT : SUCESS" + JSON.stringify(result));
        }).error(function (err) {
           console.log("UPDATE GLOBALPOINT : ERROR > " + JSON.stringify(err));
        }).finally(function () {
            console.log("UPDATE GLOBALPOINT : FINALLY ");
        });

   console.log("SETPOINTS : END");

  }

// Launch monitoring of regions
  launchMonitoring = function($scope,$rootScope,$state) {
    console.log('launchMonitoring | start!');
    // reSet beaconRegions for ALL other functions
    beaconRegions = $scope.trophies;

    // console.log($scope);
    //$scope.openModal();
    // Sucess fallback
    var onMonitoringMatch = function(regionState) {
      console.log('Trophies Factory | Sucess. ' + regionState.state + " - "+ regionState.identifier) ;
      // *** Action for controllers *** /
      // Set region
      $scope.regionState = regionState;
      // Call dispatcherlog
      $scope.dispatchThrophyEvent();
    };
    // error fallback
    var onMonitoringError = function(errorMessage) {
      console.log('Trophies Factory | Failure. ') ;
    };
      
    var onAuthoResult = function(status) {
      /* If authorization mode is activated */
      console.log('Trophies Factory | onAuthoResult') ;
      if (status == 3) {
        $scope.statusSniffer = true;
        if($rootScope.monitoringLaunched==false) {
          $rootScope.monitoringLaunched = true;
          // Start monitoring Regions
          //for (var i in beaconRegions)
          for (var i = 0; i < beaconRegions.length; i++)
          {
            var beaconRegion = beaconRegions[i];
            if (beaconRegion.isActive == true){
            console.log('*** Trophies Factory | Start Monitoring >>>' + beaconRegion.identifier) ;
              estimote.beacons.startMonitoringForRegion(beaconRegion,onMonitoringMatch,onMonitoringError);
            }
          }
        }
      }
      else {
        $rootScope.monitoringLaunched = false;
        estimote.beacons.stopMonitoringForRegion({});
        console.log("You have to have the localisation activated - Prereq " + $scope.prereq_shown);
        if($scope.prereq_shown == false) {
          $scope.gotoPrerequisites();
          $scope.prereq_shown = true;
        }
        console.log("You have to have the localisation activated - Prereq " + $scope.prereq_shown);
      }
    }

    var onAuthoError = function() {
      console.log("onAuthoError");
    }
    if (isAndroid) {
    	onAuthoResult(3);
    }
    else {
    	estimote.beacons.authorizationStatus(onAuthoResult,onAuthoError);
    }
    
  };

  return {
    // Launch Monitoring
    launchMonitoring : launchMonitoring,
    // Get Extended Region Info from BeaconRegion Identificators (identifier, uuid, major, minor)
    getFromRegion : getFromRegion,
    // Get Trophies
    getTrophies : getTrophies,
    // Get Trophies Granted
    getGrantedTrophies : getGrantedTrophies,
    // Get nMatch
    getNbMatch : getNbMatch,
    // checkIfDoublon in DB
    checkIfDoublon : checkIfDoublon,
    // Get Kist
    getListGrantedTrophies : getListGrantedTrophies,
    // Get current points
    getCurrentPoints : getCurrentPoints,
    // Set addition points
    setPoints : setPoints
  };
})

.service('BeaconService', ['$q', 'ENV', function($q, env) {
  
  console.log('BeaconService | starting... ');
    return {
        listBeacons: function() {
            var deferred = $q.defer();
            var promise = deferred.promise;

      console.log('BeaconService | using appconfig.ENV : "' + env +'"');
      if ( env == 'dev-nobackend') {
        deferred.resolve('Welcome ' + name + '!');
      } else {  

      console.log('BeaconService | calling deployd service ... ');
    
      dpd.users.login({username: name, password: pw}, function(session, error) {
        if (error) {
          console.log('error : ' + error.message);
          deferred.reject('Wrong credentials.');
          
        } else {
          console.log('success !');

          deferred.resolve('Welcome ' + name + '!');
        //location.href = "/welcome.html";

        }
      });
      console.log('LoginService | done deployd ... ');
      }

            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }

            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    }
  console.log('BeaconService | done. ') ;
  
}]);