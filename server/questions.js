module.exports = (mode, NumOfQuestions) => {
    const questions = [];
    let opperation;
    const Opperations = ['+', '-', '*', '/']
    switch(mode) {
        case "Addition":
          opperation = "+";
          break;
        case "Subtraction":
            opperation = "-";
            break;
        case "Multiplication":
            opperation = "*";
        break;

        case "Division":
          opperation = "/";
        break;

        case "Mixture":
            opperation = "Mix";
        break;
      }

        for (let i = 0; i < NumOfQuestions; i++) {
            const Nums = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
            if (Nums[1] === 0) {
                while (Nums[1] === 0) {
                    Nums[1] = Math.floor(Math.random() * 10);
                }
            }
            
            if (opperation !== "Mix") {
                const equation = `${Nums[0]} ${opperation} ${Nums[1]} = ?`;
                const answer = eval(`${Nums[0]} ${opperation} ${Nums[1]}`);
                questions.push(
                    {equation, answer}
                )
            } else {
                const opperationForProblem = Opperations[Math.floor(Math.random() * 4)]
                const equation = `${Nums[0]} ${opperationForProblem} ${Nums[1]} = ?`;
                const answer = eval(`${Nums[0]} ${opperationForProblem} ${Nums[1]}`);
                questions.push(
                    {equation, answer}
                )
            }
            
          }

      return questions;
}