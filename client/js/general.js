/* 
	Handles general templates
	like Header, Footer, and so on
*/

Template.header.current_user = function() {
	return Meteor.user();
}

/*
Tags Input
*/

Template.query_tags_token_input.rendered = function() {
    console.log($('#matched_tags').val());
}


/*

Editor related

*/

Template.editor.created = function() {
    Session.set('description', "");
    this.editor = false;
}


Template.editor.rendered = function() {
    if (!this.editor) {
        var converter = {
            makeHtml: function(text) { return marked(text); }
        };

        var editor = new Markdown.Editor(converter);
        editor.run();
        this.editor = true;
    }
    var project = Session.get('project');
    var description = project.description;
    $('#wmd-input').text(description || "");
    $('#edit-btn').tooltip({placement: 'bottom'})
    $('#preview-btn').tooltip({placement: 'bottom'})
    $('table').addClass('table table-striped table-bordered table-hover');
}

Template.editor.helpers({
    description: function() {
        return Session.get('description');
    }
});

Template.editor.events({
    'click a': function(e) {
        // always follow links
        e.stopPropagation();
    },
    'click #preview-btn': function(e, t) {
        e.preventDefault();
        var description = $('#innerEditor').text();
        Session.set('description', description);
        $('#wmd-input').hide();
        $('#preview-btn').hide();
        $('#wmd-preview').show();
        $('#edit-btn').show();
        $('table').addClass('table table-striped table-bordered table-hover');
    },
    'click #edit-btn': function(e) {
        e.preventDefault();
        $('#wmd-preview').hide();
        $('#edit-btn').hide();
        $('#wmd-input').show();
        $('#preview-btn').show();
    },
});