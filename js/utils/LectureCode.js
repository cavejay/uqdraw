let pref = ["LEL", "M8Y", "DUG", "TUF", "123", "XXX", "MEN", "F8D", "666"];
let possible = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789"; // No 0 or O

let LectureCode = {
    generate: (codes) => {
        let text = "";
         // If we weren't given anything to work with
        if(codes === undefined) return LectureCode.gen3();

        // Do we want to use a pre-made code?
        if(Math.random()>0.4) {
            let tmpCode = pref[Math.floor(Math.random()*100)%pref.length];
            if(codes.indexOf(tmpCode) == -1) return tmpCode;
        }
        while(text = LectureCode.gen3()) {
            if (codes.indexOf(text) == -1);
                return text;
        }
        return text;
    },
    gen3: () => {
        let text = "";
        for( var i=0; i < 3; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    },
}

export default LectureCode;
