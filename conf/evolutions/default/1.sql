# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table point (
  id                        bigint not null,
  latitude                  float,
  longitude                 float,
  weight                    integer,
  grouping                  integer,
  constraint pk_point primary key (id))
;

create sequence point_seq;




# --- !Downs

drop table if exists point cascade;

drop sequence if exists point_seq;

