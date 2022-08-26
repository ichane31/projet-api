import { DeleteResult, Repository } from "typeorm";
import { PostgresDataSource } from "../config/datasource.config";
import { Device } from "../model/device";

export class HyService {

    private repository: Repository<Device>;

    constructor() {
        this.repository = PostgresDataSource.getRepository(Device);
    }

    public toJSON(hy: string): string {
        let lines = hy.replace(/\r\n/g, '\n').split('\n');
        let classes = ['text', 'heading', 'image']
        let components = [];
        for (let i = 0; i < lines.length; i++) {
            let c: { size?: number, type?: string, content?: string, alt?: string } = {}, l = lines[i].split(' ');
            if (/^[#]+$/.test(l[0])) {
                c.type = 'heading';
                c.size = l[0].length;
                c.content = l.slice(1).join(' ') || '';
            } else if (l[0] == 'image') {
                c.type = 'image';
                c.content = l[1];
                c.alt = l.slice(2).join(' ') || 'image';
            } else {
                c.type = 'text';
                c.content = l.join(' ');
            }

            components.push(c);
        }
        return JSON.stringify(components);
    }
    public toHTML(hy: string): string {
        let json = JSON.parse(this.toJSON(hy));
        let html = '';
        json.forEach(x => {
            switch (x.type) {
                case 'heading':
                    let n = Math.min(Math.max(x.size, 1), 6);
                    html += `<h${n}>${x.content}</h${n}>`;
                    break;
                case 'image':
                    html += `<img src="${x.content}" alt="${x.alt}" />`;
                    break;
                default:
                    html += `<p>${x.content}</p>`;
                    break;
            }
        });
        return html;
    }

    // public HTML2JSON(html: string): any[] {
    //     function detectIMG(sub,tags){let img=sub.match(/<img[\w="\s\/+=;:\-\.!?]*>/);if(img){let s=sub.slice(0,img.index).trim();s.length&&tags.push({type:"text",content:s});let e=sub.slice(img.index+img[0].length).trim();e.length&&tags.push({type:"text",content:e}),tags.push({type:"image",content:img[0]})}else tags.push({type:"text",content:sub})}function fromHTML(html,lvl=0){html=html.replace(/<br>/g,"\r\n");for(var i=0,tags=[],j=0,t=0;;){let sub=html.slice(i),tagx=sub.match(/<[\w\s="\-]+>/);if(console.log("STEP 1 : ",lvl,i,j,"["+sub+"]"),!tagx){sub.length&&detectIMG(sub,tags);break}let txt=sub.slice(0,tagx.index);txt&&detectIMG(txt,tags);let tag=[...tagx][0],type=tag.slice(0,tag.length-1).slice(1,tag.split(" ")[0].length),end="</"+type+">",endx=sub.match(end);if(j=i,i+=tag.length,!endx)continue;i=t=j+endx.index+end.length;let m=new RegExp(tag+"[\\w<\\/>+=;:\"\\s\\.,?\\-\\(\\)!\\r'${}]*"+end),c=html.slice(j,t).match(m);c&&tags.push({type:type,content:fromHTML(c[0].slice(tag.length,c[0].length-1-tag.length),lvl+1)})}return tags}function textify(o){let t="";for(let r of o)"text"==r.type?t+=" "+r.content:t+=textify(r.content);return t.trim()}function simplify(obj){let t=[];for(let r of obj)if(/^h[1-6]+$/.test(r.type))t.push({type:"heading",level:Number(r.type[1]),content:textify(r.content)});else if("text"==r.type)t.push({...r});else if("pre"==r.type||"code"==r.type)t.push({type:"code",content:textify(r.content)});else if("image"==r.type){let alt="",content="",y=r.content;/src="[\w\s\.\-:\/+=;]+"/.test(y)&&(content=y.match(/src="[\w\s\.\-:\/+=;]+"/)[0].slice(5,-1)),/alt="[\w\s\.\-]+"/.test(y)&&(alt=y.match(/alt="[\w\s\.\-]+"/)[0].slice(5,-1)),t.push({...r,alt:alt,content:content})}else"p"==r.type||"b"==r.type||"strong"==r.type?t.push(...simplify(r.content)):t.push({...r});return t}function represent(o){o.forEach(v=>{v.content=v.content.trim()});for(let i=0;i<o.length-1;i++){let $=o[i],$$=o[i+1];"text"==$.type&&"text"==$$.type&&(o[i].content+=" "+$$.content,o.splice(i+1,1),i--)}return o}
    //     return represent(simplify(fromHTML(html)));
    // }
}

export default new HyService();