package models;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static play.test.Helpers.fakeApplication;
import static play.test.Helpers.inMemoryDatabase;

import java.util.List;

import org.junit.Before;
import org.junit.Test;

import play.test.WithApplication;

public class ModelsTest extends WithApplication {
    @Before
    public void setUp() {
        start(fakeApplication(inMemoryDatabase()));
    }
    
    @Test
    public void createAndRetrievePoints() {
        new Point(11.1, 11.1, 10, 1).save();
        new Point(12.1, 11.1, 10, 1).save();
        new Point(13.1, 11.1, 10, 2).save();
        List<Point> points = Point.find.where().eq("weight", "10").eq("grouping", "1").findList();
        assertNotNull(points);
        assertEquals(2, points.size());
    }
}