import React, { useState } from 'react';
const UseEffect=()=>{
    const [value,setvalue]=useState("");
    const [list,setList]=useState([]);
    function handleOnClick(){
        let newList=[{id:Date.now() ,value:value},...list];
        setList(newList);
        setvalue("");

    }
  return(
     <div className="conatiner">
      <div className="input-data">
        <input type="text"  value={value} onChange={(e)=>{setvalue(e.target.value)}}/>
        <button onClick={handleOnClick}>ADD</button>
      </div>
      <div className="show-data">
         {
             list.map((dataObj)=>{
                return <div key={dataObj.id}>{dataObj.value}</div>
             })
         }
      </div>
     </div>

  )
}
export default UseEffect;
