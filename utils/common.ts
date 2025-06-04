import * as XLSX from "xlsx";

export const fetchSingleData = async () => {
  try {
    // const data = JSON.parse(localStorage.getItem("singleData") || "[]");
    // if( data.length){
    //   return data;
    // }else {

      const response = await fetch('/asset/single_choice_data.xlsx');
      const arrayBuffer = await response.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, {type: 'array'});

      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      console.log(jsonData)
      // 处理数据格式
      const formattedQuestions: any[] = jsonData.map((item: any) => {
        // 提取选项 - 从__EMPTY_5到__EMPTY_12对应A-H选项
        const options = [];
        for (let i = 5; i <= 8; i++) {
          const optionKey = `__EMPTY_${i}`;
          if (item[optionKey] && item[optionKey]) {
            options.push(item[optionKey]);
          }
        }

        // 确保题目内容存在且不是空字符串
        const questionContent = item["__EMPTY_3"];
        if (!questionContent) return null;
        return {
          序号: item["__EMPTY"]?.toString() || '',
          题目板块: item["__EMPTY_1"]?.toString() || '',
          难度系数: item["__EMPTY_2"]?.toString() || '',
          题目内容: item["__EMPTY_3"]?.toString() || '',
          题目答案: item["__EMPTY_4"]?.toString() || '',
          选项: options,
          题目解析: item["__EMPTY_13"]?.toString() || '',
          文件根据: item["__EMPTY_14"]?.toString() || ''
        };
      }).filter((q: any) => q !== null); // 过滤掉无效数据
      localStorage.setItem("singleData", JSON.stringify(formattedQuestions.slice(1, formattedQuestions.length) || []))
      return formattedQuestions.slice(1, formattedQuestions.length) || []
      // setQuestions();
      // setLoaded(true);
    // }
  } catch (error) {
    console.error('Error loading Excel file:', error);
  }
};
export const fetchMultipleData = async () => {
  try {
    // const data = JSON.parse(localStorage.getItem("multipleData") || "[]");
    // if( data.length){
    //   return data;
    // }else {
    const response = await fetch('/asset/multiple_choice_data.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });

    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    const formattedQuestions = jsonData.map((item: any) => {
      const options = [];
      for (let i = 4; i <= 7; i++) {
        const optionKey = `__EMPTY_${i}`;
        if (item[optionKey]) {
          options.push(item[optionKey]);
        }
      }

      return {
        序号: item["招标代理从业人员培训题库"]?.toString() || '',
        题目板块: item["__EMPTY"]?.toString() || '',
        难度系数: item["__EMPTY_1"]?.toString() || '',
        题目内容: item["__EMPTY_2"]?.toString() || '',
        题目答案: item["__EMPTY_3"]?.toString().split('') || '',
        选项: options,
        题目解析: item["__EMPTY_12"]?.toString() || '',
        文件根据: item["__EMPTY_13"]?.toString() || ''
      };
    }).filter((q: any) => q !== null);
    const multData = formattedQuestions.slice(2, formattedQuestions.length)
    localStorage.setItem("multipleData", JSON.stringify(multData))

   return multData
  // }
  } catch (error) {
    console.error('Error loading Excel file:', error);
  }
};


