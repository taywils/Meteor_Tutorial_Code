// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players."

Players = new Meteor.Collection("players");
Photos = new Meteor.Collection("photos");

if (Meteor.is_client) {
	Template.leaderboard.players = function () {
		return Players.find({}, {sort: {score: -1, name: 1}});
	};
	
	Template.gallery.photos = function () {
		return Photos.find({});
	};

	Template.leaderboard.selected_name = function () {
		var player = Players.findOne(Session.get("selected_player"));
		return player && player.phone && player.name;
	};

	Template.player.selected = function () {
		return Session.equals("selected_player", this._id) ? "selected" : '';
	};

	Template.leaderboard.events = {
		'click input.uploadImg': function() {
			var imgUrl = "";
			imgUrl = $('#imgUrlText').val();
			var imgSrc = imgUrl;

			if( imgUrl != "" ) {
				var player = Players.findOne(Session.get("selected_player"));
				Players.update(Session.get("selected_player"), {$inc: {score: 343}});
				Photos.insert({url: imgSrc, phone: player.phone });
			}
		}
	};

	Template.player.events = {
		'click': function () {
			Session.set("selected_player", this._id);
		}
	};

	Template.game.events = {
		'click input.newGame': function () {
			Players.remove({});
			Photos.remove({});
		},

		'click input.addDrinker': function () {
			var newScore = 0;
			var newName = null;
			var newPhoneNumber = null;
			
			newPhoneNumber = $('#phoneText').val();
			newName = $('#nameText').val();

			if( $.trim(newName) != "" && $.trim(newPhoneNumber) != "" ) {
				Players.insert({ name: newName, phone: newPhoneNumber, score: newScore });
			}
		}
	};
}

// On server startup, create some players if the database is empty.
if (Meteor.is_server) {
	Meteor.startup(function () {
		if (Players.find().count() === 0) {
			var names = [
				"Click New Game",
			];

			for (var i = 0; i < names.length; i++) {
				Players.insert({name: names[i], phone: "", score: 0});
			}
		}

		if( Photos.find().count() === 0) {
			var pics = [
				"http://upload.wikimedia.org/wikipedia/commons/e/e5/Pale_Ale.jpg",
				"http://upload.wikimedia.org/wikipedia/commons/3/3e/Weizenbier.jpg",
				"http://upload.wikimedia.org/wikipedia/commons/9/99/Glass_of_K%C3%B6stritzer_Schwarzbier.jpg"
			];

			for (var i = 0; i < pics.length; i++) {
				Photos.insert({url: pics[i], phone: ""});
			}
		}
	});
}
