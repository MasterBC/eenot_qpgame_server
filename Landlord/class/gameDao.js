var mysql = require('mysql')
var async = require('async'); 

var pool = mysql.createPool({
	connectionLimit:10000,
	host:'localhost',
	user:'root',
	password:'158160212',
	prot:3306,
	database:'LandLords'
})


//摇奖记录
exports.getLotteryLog = function getLotteryLog(userInfo,callback_c){

	pool.getConnection(function(err,connection){

		var values = [];

		values.push(userInfo.accountname);
		values.push(userInfo.recordBeginTime);


		async.waterfall([
			function(callback){
				var sql = "select * from useraccounts where Account=?";
				values.push(userInfo.accountname);
				connection.query({sql:sql,values:values},function(err,rows){
					values = [];
				if (err)
				{
					console.log(err);
					callback(err);
					//callback(0);
				}else{
					if (rows.length)
						callback(null, rows[0].Id);
					else{
						callback(1,"未找帐号:"+ userInfo.accountname+"到数据");
					}
				}})

			},
			function(arg1, callback){
				var sql = "select * from lotterylog where userid=? and lotteryTime >= ?";
				values.push(arg1);
				values.push(userInfo.recordBeginTime);
				//console.log(values)
				connection.query({sql:sql,values:values},function(err,rows){
					values = [];


				if (err)
				{
					console.log(err);
					callback(err);
				}else{
					if (rows.length)
						callback(null, rows);
					else{
						callback(1,"未找到ID:"+ arg1 +"数据");
					}
				}})
			}
		], function (err, result) {
		   // result now equals 'done'
		   //console.log(result)
		   if (err){
		   	console.log(err);
		   	console.log(result);
		   	callback_c(0);
		   }
		   else{
		   	callback_c(1,result);
		   }
		   	//console.log("1end");
		   	
		   	connection.release();
			values = [];
		});
	});
}


//摇奖记录
exports.lotteryLog = function lotteryLog(userInfo,callback){
	var sql = "INSERT INTO lotterylog(userid,bet,line_s,score_before,score_linescore,score_win,score_current,free_count_before,free_count_win,free_count_current,result_array) VALUES(?,?,?,?,?,?,?,?,?,?,?)";
	var values = [];

	values.push(userInfo.userid);
	values.push(userInfo.bet);
	values.push(userInfo.lines);
	values.push(userInfo.score_before);
	values.push(userInfo.score_linescore);
	values.push(userInfo.score_win);
	values.push(userInfo.score_current);
	values.push(userInfo.free_count_before);
	values.push(userInfo.free_count_win);
	values.push(userInfo.free_count_current);
	values.push(userInfo.result_array);

	
	//console.log(values)
	//console.log(user.password)


	pool.getConnection(function(err,connection){

	 	connection.query({sql:sql,values:values},function(err,rows){
			if (err)
			{
				console.log(err);
				callback(0);
			}else{
				callback(1);
			}})

		connection.release();
		values = [];
		
	});
}

//捕鱼结算记录
exports.balanceLog = function balanceLog(userInfo,bulletActivity,everyWinCoinActivity,lvActivity,gameId,serverId,callback){
	var sql = "call addFishlog(?,?,?,?,?,?,?,?)";
	var values = [];
	values.push(userInfo.userid);
	values.push(userInfo.useCoin);
	values.push(userInfo.winCoin);
	values.push(bulletActivity);
	values.push(everyWinCoinActivity);
	values.push(lvActivity);
	values.push(gameId);
	values.push(serverId);
	
	if (userInfo.useCoin > 0)
	{
		pool.getConnection(function(err,connection){

		 	connection.query({sql:sql,values:values},function(err,rows){
				if (err)
				{
					console.log("balanceLog");
					console.log(err);
					callback(0);
				}else{
					callback(1);
				}})

			connection.release();
			values = [];
			
		});
	}else{
		callback(0);
	}
}
//结算主表
exports.GetSettlement=function Settlement(array,callback) {
	var sql="INSERT INTO the_main_table(matchId,tableId,seat1userId,seat2userId,seat3userId,points,Calls,Bomb,seat1win,seat2win,seat3win,tax,ServerId,times)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
	var values=[];

	values.push(array.matchId);
	values.push(array.tableId);
	values.push(array.user1);
	values.push(array.user2);
	values.push(array.user3);
	values.push(array.points);
	values.push(array.double);
	values.push(array.zhadan);
	values.push(array.user11);
	values.push(array.user22);
	values.push(array.user33);
	values.push(array.tax);
	values.push(array.server);
	values.push(array.game);
	console.log(values);


	pool.getConnection(function(err,connection){
		connection.query({sql:sql,values:values},function(err,rows){
			if(err){
				console.log(err);
				callback(0);
			}else{
				console.log(rows);
				callback(1);
			}
		})
		connection.release();
		Vlues=[];
	})

}

//记录牌库
exports.SaveCarcd=function SaveCarcd(matchid,userid,carcdout,time,callback){
	var sql="INSERT INTO carcd_table(matchId,userId,carcdout,newtime)VALUES(?,?,?,?)";
	var value=[];

	value.push(matchid);
	value.push(userid);
	value.push(carcdout);
	value.push(time);

	pool.getConnection(function(err,connection){
		connection.query({sql:sql,values:value},function(err,rows){
			if(err){
				console.log(err);
				callback(0)
			}else{
				console.log(rows)
				callback(1)
			}
		})
		connection.release();
		value=[];
	})
}

 exports.getMatchId = function getMatchId(_roomType,callback){
 	var sql = "SELECT MAX(matchId) as maxid FROM matchRandking where MatchId=?";

 	var values = [];
 	values.push(_roomType);

 	pool.getConnection(function(err,connection){

 	 	connection.query({sql:sql,values:values},function(err,rows){
 			if (err)
 			{
				console.log(err);
 				callback(0);
   			}else{
   				if (rows[0].maxid){
   					callback(rows[0].maxid);
   				}else{
   					callback(0);
   				}
				
 			}})

   		connection.release();
   		values = [];
		
   	});
   }


//上下分记录
exports.score_changeLog = function score_changeLog(userInfo){
	var sql = "INSERT INTO score_changelog(userid,score_before,score_change,score_current,change_type,isOnline) VALUES(?,?,?,?,?,?)";
	var values = [];

	values.push(userInfo.userid);
	values.push(userInfo.score_before);
	values.push(userInfo.score_change);
	values.push(userInfo.score_current);
	values.push(userInfo.change_type);
	values.push(userInfo.isOnline);
	
	//console.log(values)
	//console.log(user.password)

	pool.getConnection(function(err,connection){

	 	connection.query({sql:sql,values:values},function(err,rows){
			if (err)
			{
				console.log(err);
			}
		})

		connection.release();
		values = [];
		
	});
}


//更新道具
exports.getPropByUserId = function getPropByUserId(_userInfo,callback){
	var sql = 'CALL gameaccount.updateProp(?,?,?,?,1)';
	var values = [];

	values.push(_userInfo.userId);
	values.push(_userInfo.propId);
	values.push(_userInfo.propCount);
	values.push(_userInfo.roomid);

	pool.getConnection(function(err,connection){

	 	connection.query({sql:sql,values:values},function(err,rows){
			if (err)
			{
				console.log(err);
				callback(0);
			}else{
				if (rows.length == 0){
					callback(0);
				}else{
					callback(1);
					}
		 		}
	 		})
		connection.release();
		values = [];
	});
}

// exports.calculateRank = function calculateRank(_info,callback){
// 	var sql = 'CALL calculateRank(?,?)';
// 	var values = [];

// 	values.push(_info.matchId);
// 	values.push(_info.roomType);

// 	pool.getConnection(function(err,connection){

// 	 	connection.query({sql:sql,values:values},function(err,rows){
// 			if (err)
// 			{
// 				console.log(err);
// 				callback(0);
// 			}else{
// 				if (rows.length == 0){
// 					callback(0);
// 				}else{
// 					callback(1);
// 					}
// 		 		}
// 	 		})
// 		connection.release();
// 		values = [];
// 	});
// }

//修改彩池
exports.UpdatePool = function UpdatePool(info,callback){
	var sql = 'UPDATE pool SET pool=?,virtualPool=? WHERE serveId=?';
	var values = [];

	values.push(info.pool);
	values.push(info.virtualPool);
	values.push(info.serverId);


	pool.getConnection(function(err,connection){

	 	connection.query({sql:sql,values:values},function(err,rows){
	 		connection.release();
			if (err)
			{
				console.log("UpdatePool");
				console.log(err);
				callback(0);
			}else{
				callback(1);
			}})

		
		values = [];
		
	});
}


//获得彩池
exports.getPool = function getPool(serveId,callback){
	var sql = 'select * FROM pool WHERE serveId=?';
	var values = [];

	values.push(serveId);


	pool.getConnection(function(err,connection){

	 	connection.query({sql:sql,values:values},function(err,rows){
	 		connection.release();
			if (err)
			{
				console.log("getPool");
				console.log(err);
				callback(0);
			}else{

				if (rows.length)
					callback(1, rows);
				else{
					callback(0);
				}
			}})

		
		values = [];
		
	});
}


