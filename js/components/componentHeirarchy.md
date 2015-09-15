#Component Heirarchy
The following document give an overview of the heirarchy of components. There is no detail about flow between top-level components, just an overview of how they are nested inside of each other.

##General Use
- UI.jsx
- Header.jsx
	- Logo.jsx


##View Heirarchy
- StartView.jsx
- Welcome.jsx
	- SubjectList.jsx
- Presenter.jsx
	- Timer.jsx
	- PresenterQuestion.jsx
	- PresenterResponses.jsx
	- QuestionSelector.jsx (weird that this one has this name but is in here, but it is nonetheless).
- QuestionManager.jsx
	- QuestionList.jsx
		- Question.jsx
		- QuestionComposer.jsx
	- LectureComposer.jsx
- Responder.jsx
	- Drawing.jsx
- Archive.jsx

##Not Yet Implemented
- Responses.jsx (used in archiving, will probably be removed).
