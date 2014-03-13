package controllers;

import play.*;
import play.mvc.*;

import views.html.*;

public class Application extends Controller {

	public static Result index() {
		return redirect(routes.Application.showMap());
	}

	public static Result showMap() {
		return ok(views.html.map.render());
	}
	
	public static Result showAbout() {
		return ok(views.html.text.about.render());
	}

	public static Result showReferences() {
		return ok(views.html.text.references.render());
	}
	
	public static Result showResources() {
		return ok(views.html.text.resources.render());
	}
}
