import * as express from "express";


declare global{
  namespace express{
    interface Request{
     id:Record<string>;
     is_delete:Record<boolean>; 
     //user?: Record<string,any>
    }
  }
}