import P from"imap";import{simpleParser as v}from"mailparser";import"util";import{EventEmitter as I}from"events";var m=class extends I{imap;options;constructor(t){if(!t)throw new Error("options is required!");super(),this.options=t,this.imap=this._setupImap()}_setupImap(){let t=this,{user:n,password:o,host:s,port:r}=t.options,e=new P({user:n,password:o,host:s,port:Number.parseInt(r,10),tls:!0,tlsOptions:{rejectUnauthorized:!1}});return e.on("ready",function(){t.emit("email receiver started!"),e.openBox("INBOX",!0,function(i,d){if(i)throw t.emit("error",i),i;e.on("mail",B=>{let c=e.seq.fetch(d.messages.total,{bodies:"",struct:!0});c.on("message",function(a,x){let E="(#"+x+") ";a.on("body",function(f,q){let u="",b=0;f.on("data",function(p){b+=p.length,u+=p.toString("utf8")}),f.once("end",function(){v(u).then(p=>{let{subject:h,text:w,html:y,attachments:O}=p;h&&t.emit(h,{text:w,html:y,attachments:O})})})}),a.on("end",function(){})}),c.on("error",function(a){}),c.on("end",function(){t.emit("end")})})})}),e}start(){this.imap.connect()}stop(){this.imap.end()}use(){}useCmds(t){let n=this;t.forEach(o=>{n.on(o.command,o.action)})}};import{createTransport as M}from"nodemailer";var l=class{transport;constructor(t){if(!t)throw new Error("options is required!");let{user:n,password:o,smtphost:s,smtpport:r,proxy:e}=t,i={pool:!0,host:s,port:r,secure:!0,auth:{user:n,pass:o},proxy:e};this.transport=M(i)}testTransport(){return new Promise((t,n)=>{this.transport.verify((o,s)=>{o?n(o):t(s)})})}send(t,n,o,s,r){return this.transport.sendMail({from:t,to:n,subject:o,text:s,html:r})}};export{m as EmailListener,l as EmialSender};
