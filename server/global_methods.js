Meteor.methods({
	getNextSequence: function (name) {
		var doc_ret = Id_counters.upsert({_id: name}, {$inc: {seq: 1}});
		var find_doc = Id_counters.findOne({_id: doc_ret.insertedId});

		return find_doc.seq;
	}
});

