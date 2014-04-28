bearbones
=========
A simple question and answering web app.


To-Do
	- For voting, the cookies need to be separated by user_id. To ensure that votes are indicated by which user voted.
  
	  Example: 
	    {
	      user_id: {cookie_object}
	      asdfas;dlfkjasdf: {asdfasdfasdf: up, werwer2qasdf: down}
	    }
  

Proposed structure for influence points

	influence_points : {
				tag_name: {influence_points: 23, level: 1},
				tag_name_2: {influence_points: 54, level: 4}
}
