(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{304:function(e,t,a){e.exports=a(583)},310:function(e,t,a){},583:function(e,t,a){"use strict";a.r(t);var n=a(0),l=a.n(n),r=a(7),c=a.n(r),i=(a(309),a(310),a(591)),o=a(592),s=a(595),m=a(593),u=(a(311),a(599)),d=u.a.Title,p=function(e){e.user;return l.a.createElement("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-around",height:100,backgroundColor:"#096dd9"}},l.a.createElement(d,{level:2,style:{color:"#ffffff"}},"Welcome to your Dashboard"))},E=a(112),f=a(129),g=a(83),y=a(67);function h(e){return{type:"ADD_CARD",payload:e}}var v=a(45),b=a(58),w=a(596),O=a(598),x=a(601),j=a(602),C=a(603),S=w.a.Option,R=Object(y.b)((function(e){return{sideDrawerR:e.sideDrawerReducer}}),(function(e){return{close:function(){e({type:"CLOSE"})},addCard:function(t){e(h(t))}}}))((function(e){var t=Object(n.useState)({name:"",ip:"",exploit:"",description:""}),a=Object(b.a)(t,2),r=a[0],c=a[1],s=Object(n.useState)(!1),m=Object(b.a)(s,2),u=m[0],d=m[1],p=O.a.useForm(),E=Object(b.a)(p,1)[0],f=function(){e.close(),d(!1),c({name:"",ip:"",exploit:"",description:""}),E.resetFields()};return l.a.createElement(l.a.Fragment,null,l.a.createElement(x.a,{title:"Create new pentest ",width:720,onClose:f,visible:e.sideDrawerR.isOpen,bodyStyle:{paddingBottom:80}},l.a.createElement(O.a,{layout:"vertical",hideRequiredMark:!0,form:E},l.a.createElement(i.a,{gutter:16},l.a.createElement(o.a,{span:12},l.a.createElement(O.a.Item,{name:"name",label:"Name",rules:[{required:!0,message:"Name can't be empty!"}]},l.a.createElement(j.a,{onChange:function(e){return c(Object(v.a)({},r,{name:e.target.value}))},placeholder:"Give your pentest a name"}))),l.a.createElement(o.a,{span:12},l.a.createElement(O.a.Item,{name:"ipAddress",label:"Target IP address",rules:[{required:!0,message:"IP Address can't be empty!"}]},l.a.createElement(j.a,{onChange:function(e){return c(Object(v.a)({},r,{ip:e.target.value}))},placeholder:"Please enter ip address"})))),l.a.createElement(i.a,{gutter:16},l.a.createElement(o.a,{span:12},l.a.createElement(O.a.Item,{name:"exploit",label:"Exploit",rules:[{required:!0,message:"Exploit can't be empty!"}]},l.a.createElement(w.a,{onChange:function(e){return c(Object(v.a)({},r,{exploit:e}))},placeholder:"Please select an exploit"},l.a.createElement(S,{value:"Ddos"},"Ddos"),l.a.createElement(S,{value:"ip spoofing"},"IP Spoofing"),l.a.createElement(S,{value:"man in the middle"},"Man in the middle"))))),l.a.createElement(i.a,{gutter:16},l.a.createElement(o.a,{span:24},l.a.createElement(O.a.Item,{name:"description",label:"Description",rules:[{required:!1,message:"please enter url description"}]},l.a.createElement(j.a.TextArea,{onChange:function(e){return c(Object(v.a)({},r,{description:e.target.value}))},rows:4,placeholder:"please enter short description"})))),l.a.createElement("div",{style:{display:"flex",flexDirection:"column",width:"100%",height:"40vh"}},l.a.createElement("div",{style:{display:"flex",justifyContent:"center"}},u?l.a.createElement(C.a,{status:"error",title:"Oppss...",subTitle:"Please check the required fileds are filled before resubmitting."}):null),l.a.createElement(O.a.Item,null,l.a.createElement("div",{style:{position:"fixed",bottom:"20px",right:"20px"}},l.a.createElement(g.a,{type:"primary",htmlType:"submit",onClick:function(){""!==r.name&&""!==r.ip&&""!==r.exploit?(e.addCard(r),console.log(r),f()):d(!0)},style:{marginRight:8}},"Create"),l.a.createElement(g.a,{onClick:f},"Cancel")))))))})),k=a(597),D=a(207),P=a(605),I=a(288),z=a.n(I),L=a(607),A=function(e){var t=e.details;return l.a.createElement(f.a,{title:t.description},l.a.createElement(k.a,{raised:!0,style:{width:190},onClick:function(){return console.log(t.description)}},l.a.createElement(k.a.Content,null,l.a.createElement("div",{style:{display:"flex",flexDirection:"column",alignItems:"flex-start"}},l.a.createElement(D.a,{style:{alignSelf:"center"},size:"huge",name:"laptop"}),l.a.createElement(z.a,{style:{alignSelf:"center"}},t.name))),l.a.createElement(k.a.Content,{extra:!0},l.a.createElement(P.a,{columns:1,style:{width:"100%"}},l.a.createElement(P.a.Row,null,l.a.createElement(D.a,{style:{marginLeft:10},size:"large",name:"computer"}),t.ip),l.a.createElement(P.a.Row,null,l.a.createElement(D.a,{style:{marginLeft:10},size:"large",name:"user secret"}),t.exploit),l.a.createElement(P.a.Row,null,l.a.createElement(L.a,{style:{marginLeft:10,marginRight:10,fontSize:20}}),"working...")))))},T=a(608),M=u.a.Title,N=Object(y.b)((function(e){return{cardR:e.cardsReducer,sideDrawerR:e.sideDrawerReducer}}),(function(e){return{addCard:function(t){e(h(t))},open:function(){e({type:"OPEN"})}}}))((function(e){return l.a.createElement("div",{style:{width:"100%",display:"block"}},l.a.createElement(R,null),l.a.createElement("div",{style:{display:"flex"}},l.a.createElement(M,{level:4,style:{color:"#91d5ff",marginLeft:20}},"Home")),l.a.createElement(m.a,null),0===e.cardR.cards.length?l.a.createElement("div",{style:{height:"80vh",width:"100%",display:"flex",justifyContent:"center"}},l.a.createElement(E.a,{style:{alignSelf:"center"}})):function(e){return l.a.createElement("div",{style:{height:"70vh",width:"100%",display:"flex",alignContent:"flex-start",justifyContent:"flex-start",flexWrap:"wrap"}},e.cardR.cards.map((function(e,t){return l.a.createElement("div",{style:{margin:10}},l.a.createElement(A,{details:e}))})))}(e),l.a.createElement("div",{style:{position:"fixed",bottom:"40px",right:"40px"}},l.a.createElement(f.a,{title:"Create new PenTest"},l.a.createElement(g.a,{type:"primary",shape:"circle",size:"large",icon:l.a.createElement(T.a,null),onClick:function(){e.open()}}))))})),U=a(110),q=a(38),W=u.a.Title,B=function(){return l.a.createElement("div",{style:{width:"100%"}},l.a.createElement("div",{style:{display:"flex"}},l.a.createElement(W,{level:4,style:{color:"#91d5ff",marginLeft:20}},"AWS")),l.a.createElement(m.a,null),l.a.createElement("div",{style:{height:"80vh",width:"100%",display:"flex",justifyContent:"center"}},l.a.createElement(E.a,{style:{alignSelf:"center"}})))},F=a(611),G=a(612),Z=a(613),H=a(614),J=u.a.Title,$=function(){return l.a.createElement("div",{style:{width:"100%"}},l.a.createElement("div",{style:{display:"flex"}},l.a.createElement(J,{level:4,style:{color:"#91d5ff",marginLeft:20}},"Docker")),l.a.createElement(m.a,null),l.a.createElement("div",{style:{height:"80vh",width:"100%",display:"flex",justifyContent:"center"}},l.a.createElement(E.a,{style:{alignSelf:"center"}})))},_=a(606),K=a(594),V=a(604),Q=a(609),X=a(610);var Y=a(600),ee=Object(y.b)((function(e){return{newUserModal:e.newUserModalReducer}}),(function(e){return{close:function(){e({type:"CLOSE"})}}}))((function(e){var t=Object(n.useState)(!1),a=Object(b.a)(t,2),r=a[0],c=a[1],i=Object(n.useState)(!1),o=Object(b.a)(i,2),s=o[0],m=o[1],u=Object(n.useState)({email:"",newPass:"",newPassRepeat:""}),d=Object(b.a)(u,2),p=d[0],E=d[1],f=/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/,g=function(){return""!==p.email&&""!==p.newPass&&""!==p.newPassRepeat&&(!!f.test(p.email)&&p.newPass===p.newPassRepeat)};return l.a.createElement(l.a.Fragment,null,l.a.createElement(Y.a,{centered:!0,title:"New user",visible:e.newUserModal.isOpen,onOk:function(){c(!0),setTimeout((function(){g()?(e.close(),c(!1),m(!1)):(m(!0),console.log("Not Valid User!"),c(!1))}),2e3)},onCancel:function(){m(!1),e.close()},confirmLoading:r},l.a.createElement("div",{style:{display:"flex",alignSelf:"center",flexDirection:"column",width:"100%"}},l.a.createElement(_.b,{size:"large",direction:"vertical"},l.a.createElement(j.a,{size:"large",placeholder:"Enter your email",prefix:l.a.createElement(Q.a,null),onChange:function(e){return E(Object(v.a)({},p,{email:e.target.value}))}}),l.a.createElement(j.a.Password,{size:"large",placeholder:"Enter new password",prefix:l.a.createElement(X.a,null),onChange:function(e){return E(Object(v.a)({},p,{newPass:e.target.value}))}}),l.a.createElement(j.a.Password,{size:"large",placeholder:"Enter new password again",prefix:l.a.createElement(X.a,null),onChange:function(e){return E(Object(v.a)({},p,{newPassRepeat:e.target.value}))}}),s?l.a.createElement(V.a,{message:"Be sure you've entered valid information",type:"error"}):null))))})),te=Object(y.b)((function(e){return{newUserModal:e.newUserModalReducer}}),(function(e){return{open:function(){e({type:"OPEN"})}}}))((function(e){var t=Object(q.f)(),a=Object(n.useState)(!1),r=Object(b.a)(a,2),c=r[0],i=r[1],o=Object(n.useState)(!1),s=Object(b.a)(o,2),m=s[0],u=s[1],d=Object(n.useState)(""),p=Object(b.a)(d,2),E=p[0],f=p[1],y=Object(n.useState)(""),h=Object(b.a)(y,2),v=h[0],w=h[1];return l.a.createElement("div",{style:{display:"flex",justifyContent:"center",height:"100vh",width:"100%",flexDirection:"column"}},l.a.createElement("div",{style:{display:"flex",alignSelf:"center",flexDirection:"column",width:"350px"}},l.a.createElement(_.b,{size:"large",direction:"vertical"},l.a.createElement(j.a,{size:"large",placeholder:"Enter email",prefix:l.a.createElement(Q.a,null),onChange:function(e){return f(e.target.value)}}),l.a.createElement(j.a.Password,{size:"large",placeholder:"Enter password",prefix:l.a.createElement(X.a,null),onChange:function(e){return w(e.target.value)}}))),l.a.createElement(ee,null),l.a.createElement("div",{style:{display:"flex",marginTop:"25px",marginBottom:"25px",justifyContent:"center"}},m?l.a.createElement(K.a,{size:"large",tip:"Loading..."}):l.a.createElement("div",null,l.a.createElement(g.a,{type:"primary",shape:"round",onClick:function(){u(!0),setTimeout((function(){""===E||""===v?(i(!0),u(!1)):(console.log(E,v),t.push("/home"))}),1500)}},"Login"),l.a.createElement(g.a,{type:"link",onClick:function(){return e.open()}},"Not a User? register"))),c?l.a.createElement(V.a,{style:{width:"400px",alignSelf:"center"},message:"Error",description:"Email or password are wrong. Please try again",type:"error",showIcon:!0}):null)}));function ae(){return l.a.createElement(U.a,null,l.a.createElement(q.c,null,l.a.createElement(q.a,{path:"/login"},l.a.createElement(te,null)),l.a.createElement("div",null,l.a.createElement(i.a,null,l.a.createElement(o.a,{span:24},l.a.createElement(p,null))),l.a.createElement(i.a,null,l.a.createElement(o.a,{span:6},l.a.createElement(s.a,{style:{width:"100%"},defaultSelectedKeys:["1"],mode:"inline"},l.a.createElement(s.a.ItemGroup,{key:"g1",title:"General"},l.a.createElement(m.a,null),l.a.createElement(s.a.Item,{key:"1",icon:l.a.createElement(F.a,null)},l.a.createElement(U.b,{to:"/home"},"Home")),l.a.createElement(s.a.Item,{key:"2",icon:l.a.createElement(G.a,null)},l.a.createElement(U.b,{to:"/aws"},"AWS")),l.a.createElement(s.a.Item,{key:"3",icon:l.a.createElement(Z.a,null)},l.a.createElement(U.b,{to:"/metasploit"},"Metasploit Details")),l.a.createElement(s.a.Item,{key:"4",icon:l.a.createElement(H.a,null)},"More")))),l.a.createElement(o.a,{span:18},l.a.createElement(i.a,null,l.a.createElement(q.a,{path:"/home"},l.a.createElement(N,null)),l.a.createElement(q.a,{path:"/aws"},l.a.createElement(B,null)),l.a.createElement(q.a,{path:"/metasploit"},l.a.createElement($,null))))))))}Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var ne=a(108),le=a(291),re=a.n(le),ce=a(293),ie={cards:[]},oe=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:ie,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"ADD_CARD":e=Object(v.a)({},e,{cards:[].concat(Object(ce.a)(e.cards),[t.payload])})}return e},se={isOpen:!1},me=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:se,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"OPEN":e=Object(v.a)({},e,{isOpen:!0});break;case"CLOSE":e=Object(v.a)({},e,{isOpen:!1})}return e},ue={isOpen:!1},de=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:ue,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"OPEN":e=Object(v.a)({},e,{isOpen:!0});break;case"CLOSE":e=Object(v.a)({},e,{isOpen:!1})}return e},pe=Object(ne.d)(Object(ne.c)({cardsReducer:oe,sideDrawerReducer:me,newUserModalReducer:de}),{},Object(ne.a)(re.a));c.a.render(l.a.createElement(y.a,{store:pe},l.a.createElement(ae,null),","),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[304,1,2]]]);
//# sourceMappingURL=main.ac28d7df.chunk.js.map