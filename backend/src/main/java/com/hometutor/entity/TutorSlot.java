package com.hometutor.entity;

import jakarta.persistence.*;

@Entity
public class TutorSlot {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private TutorProfile tutor;

    // store date as ISO string (yyyy-MM-dd) and time as HH:mm
    private String date;
    private String start;
    private String end;
    private boolean open = true;

    public Long getId(){ return id; }
    public TutorProfile getTutor(){ return tutor; }
    public void setTutor(TutorProfile tutor){ this.tutor = tutor; }
    public String getDate(){ return date; }
    public void setDate(String date){ this.date = date; }
    public String getStart(){ return start; }
    public void setStart(String start){ this.start = start; }
    public String getEnd(){ return end; }
    public void setEnd(String end){ this.end = end; }
    public boolean isOpen(){ return open; }
    public void setOpen(boolean open){ this.open = open; }
}
