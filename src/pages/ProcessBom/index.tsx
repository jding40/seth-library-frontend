import {type FC, useState, useRef, useEffect} from "react";

const ProcessBom: FC = () => {

    const [originalString, setOriginalString] = useState<string>("")

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const qtyForMultiLines:number[]=[]
    let lineCount:number=0;

    // 让 textarea 自适应高度
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [originalString]);

    function expandRange(input: string): string {
        const parts = input.split(",").map(s => s.trim()).filter(Boolean);
        const out: string[] = [];

        for (const part of parts) {
            if (!part.includes("-")) {
                out.push(part);
                continue;
            }

            const [leftRaw, rightRaw] = part.split("-").map(s => s.trim());
            const leftMatch = leftRaw.match(/^(.*?)(\d+)$/);
            const rightMatch = rightRaw.match(/^(.*?)(\d+)$/);

            // 如果左侧无法解析成 base+number，则原样保留（不展开）
            if (!leftMatch) {
                out.push(part);
                continue;
            }

            const leftBase = leftMatch[1];           // 左侧非数字前缀（可能包含下划线）
            const leftNum = parseInt(leftMatch[2], 10);

            // 右侧如果解析失败也原样保留
            if (!rightMatch) {
                out.push(part);
                continue;
            }

            const rightBase = rightMatch[1];         // 右侧非数字前缀（可能为空）
            const rightNum = parseInt(rightMatch[2], 10);

            // 选择使用哪个 base: 优先使用右侧提供的 base（如果为空则用左侧）
            const base = rightBase === "" ? leftBase : rightBase;

            // 支持升序或降序范围
            if (leftNum <= rightNum) {
                for (let i = leftNum; i <= rightNum; i++) {
                    out.push(`${base}${i}`);
                }
            } else {
                for (let i = leftNum; i >= rightNum; i--) {
                    out.push(`${base}${i}`);
                }
            }
        }

        return out.join(",");
    }

    const parseString = (str: string):string=>{
        const materials:string[] = str.split(",")
        for (let i = 0; i < materials.length; i++) {
            console.log("materials[i]: ",materials[i])
           if(materials[i].includes("-")){
               //const[strS, strE] = materials[i].split("-");
               materials[i]=expandRange(materials[i]);
           }
        }

            return materials.join(",");
    }

    const parseMultipleLine = (str:string):string=>{
        const lines:string[] = str.split("\n");
        lineCount=lines.length;
        for(let i = 0; i<lines.length; i++){
            lines[i]=parseString(lines[i]);
            qtyForMultiLines.push(countQty(lines[i]));
        }
        return lines.join("\r\n")
    }

    function countQty(str:string) {
        if (str === "") return 0;
        return str.split(",").length;
    }

    //const parsedString = parseString(originalString);
    const parsedString:string = parseMultipleLine(originalString);
    const totalQty:number = countQty(parsedString);



    return(<div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl space-y-6">
        {/* 输入区域 */}
        <div>
            <label className="block text-gray-800 font-semibold mb-2">
                Original String
            </label>
            <textarea
                ref={textareaRef}
                value={originalString}
                onChange={(e) => setOriginalString(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 font-mono text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none overflow-hidden"
                placeholder="例如: A1-A3, B5-B2, C7"
            />
        </div>

        {/* 单行数量统计 */}
        {totalQty>0 && lineCount == 1&& <div className="flex items-center space-x-3">
            <h2 className="text-lg font-semibold text-gray-800 self-start">Total Qty:</h2>
            <span className="px-3 py-1 bg-blue-600 text-white text-sm font-bold rounded-full shadow">
          {totalQty}
        </span>
        </div>}

        {/* 多行数量统计 */}
        {totalQty>0 && lineCount >1 && <div className="flex items-center space-x-3">
            <h2 className="text-lg font-semibold text-gray-800 self-start">Total Qty:</h2>
            <div className="px-3 py-1 bg-blue-600 text-white text-sm font-bold rounded-2xl shadow">
          {qtyForMultiLines.map((qty:number)=><div className={"w-20 text-center"}>{qty}</div>)}
        </div>
        </div>}

        <hr className="border-gray-200" />

        {/* 解析结果 */}
        {parsedString && <div>
            <h1 className="text-lg font-semibold text-gray-800 mb-2">
                Parsed String
            </h1>
            <p className="p-3 bg-gray-100 border border-gray-300 rounded-lg font-mono text-sm text-gray-700 whitespace-pre-wrap break-words">
                {parsedString}
            </p>
            <textarea
                value={parsedString}   // parsedString 里是 lines.join("\r\n")
                readOnly
                className="w-full border rounded p-3 font-mono text-sm text-gray-700 h-40 resize"
            >{parsedString}</textarea>
        </div>}
    </div>)

}

export default ProcessBom;
