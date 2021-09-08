// import React ,{useEffect} from 'react';
// import v1 from './v1.mp4';
// import v2 from './v2.mp4';
// import v3 from './v3.mp4';
// import v4 from './v4.mp4';
// import "./Intersection.css";


// const InterestionDemo = () => {
//     let conditionObject={
//         root:null,
//         threshold:"0.8"
//     };
//     function cb(enteries){
//         // console.log(enteries);
//         enteries.forEach((entry)=>{
//             let child=entry.target.children[0];
//             // console.log(child);
//             child.play().then(function(){
//                 if(entry.isIntersecting ==false){
//                     child.pause();
//                 }
//             })
//         })
        
//     }
//     useEffect(()=>{
//       let ObserverObject=new IntersectionObserver(cb,conditionObject);
//       let VideoElements=document.querySelectorAll(".video-conatiner");
//        VideoElements.forEach((ele)=>{
//            ObserverObject.observe(ele);
//        })

//     },[])
//     return ( 
//         <>
//            <div className="video-conatiner">
//                <Video  src={v1} id='a'></Video>
//            </div>
//            <div className="video-conatiner">
//                <Video src={v2} id='b'></Video>
//            </div>
//            <div className="video-conatiner">
//                <Video src={v3} id='c'></Video>
//            </div>
//            <div className="video-conatiner">
//                <Video src={v4} id='d'></Video>
//            </div>
//         </>
//      );
// }

// function Video(props){
//     return(
//         <video className="video-styles"controls  muted={true} id={props.id} loop={true}>
//             <source src={props.src} type="video/mp4"></source>
//         </video>
//     )
// }
 
// export default InterestionDemo;