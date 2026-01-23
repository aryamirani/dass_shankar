
window.words = ["Great!", "Good!", "Very Good!","Awesome","Excellent"];


window.showFeedback=function() {
            const feedback = document.getElementById("feedback");
            const word = words[Math.floor(Math.random() * words.length)];
            if (!feedback) return;

            feedback.textContent = word;
            feedback.classList.remove("hidden");
            feedback.classList.add("show");

            setTimeout(() => {
                feedback.classList.remove("show");
                setTimeout(() => feedback.classList.add("hidden"), 300);
            }, 900);
        }