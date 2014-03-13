package models;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Id;

import play.db.ebean.Model;

@Entity
public class Point extends Model {

	private static final long serialVersionUID = 1L;
	
	@Id
    public Long id;
    public double latitude;
    public double longitude;
    public int weight;
    public int grouping;
    
    public Point(double latitude, double longitude, int weight) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.weight = weight;
        this.grouping = 1;
   }
    
    public Point(double latitude, double longitude, int weight, int grouping) {
      this.latitude = latitude;
      this.longitude = longitude;
      this.weight = weight;
      this.grouping = grouping;
    }

    public static Finder<String,Point> find = new Finder<String,Point>(
        String.class, Point.class
    ); 
    
    public static List<Point> findInvolving(String weight, String grouping) {
        return find.where()
        	.eq("weight", weight)
            .eq("grouping", grouping)
            .findList();
    }
}