const fs = require('fs');


const getClippings = (value: String) => {
    // 最终得到的数组
    const clippingArr = [];

    /**
     * 解析文件
     */
    const buffer = fs.readFileSync(value);
    const text = String(buffer);

    // 获取到每一条剪报的数组
    const pattC = /==========/;
    const textArr = text.split(pattC);

    /**
     * 正则规则
     */
    // 获取页码位置location
    const pattL = /您在位置 #(\S*)的(标注|笔记)/;
    // 获取bookName
    //   const pattN = /- 您在位置/
    // 获取作者
    const pattA = /\s\((.*)\)\s/;
    // 获取添加时间
    const pattT = /添加于.*/;
    // 获取内容
    const pattContent = /添加于.*/;

    //   获取最终的数组
    for (let index = 0; index < textArr.length; index++) {
        const item = textArr[index];

        const hasLocation = item.match(pattL);

        if (hasLocation) {
            const location = hasLocation[1];
            location && location.trim();

            const bookName = item.split(pattA)[0];
            bookName && bookName.trim();

            const author = item.match(pattA)[1];
            author && author.trim();

            const addTime = item.match(pattT)[0];
            addTime && addTime.trim();

            let content = item.split(pattContent)[1];
            content && content.trim();
            if (content) {
                content = content.replace(/\\r\\n/g, '');
            }

            const data = {
                bookName,
                author,
                location,
                addTime,
                content
            };
            clippingArr.push(data);
        } else {
            continue;
        }
    }
    return clippingArr;
};

export default getClippings;
