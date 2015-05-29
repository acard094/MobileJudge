/**
 * This file provided by Facebook is for non-commercial testing and evaluation purposes only.
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var Header = React.createClass({
	displayName: 'Header',

	render: function() {
		return (
			<div className="pageheader">Grades</div>
		);
	}
});

var Student = React.createClass({
	displayName: 'Student',

	render: function () {
		return (
			<tr>
			<td>{this.props.student}</td>
			<td>{this.props.judge}</td>
			<td>{this.props.grade}</td>
			</tr>
		);
	}
});

var Spacer = React.createClass({
	    render: function () {
       return false;
	    }
});

var Students = React.createClass({
displayName: 'Students',

render: function () {
var studentList = this.props.data.map(function (student) {
	return (
		<Student student={student.Student} judge={student.judge} grade={student.grade} />
		);
	});
return (<tbody>{studentList}</tbody>);
}
});

var GradeChangeForm = React.createClass({
	    handleSubmit: function(e) {
				        e.preventDefault();
								        var student = React.findDOMNode(this.refs.student).value.trim();
												        var judge = React.findDOMNode(this.refs.judge).value.trim();
																        var grade = React.findDOMNode(this.refs.grade).value.trim();
																				//if(student || judge || grade) return;
																				this.props.onStudentSubmit({student: student, judge: judge, grade: grade});
																				React.findDOMNode(this.refs.student).value = '';
																				React.findDOMNode(this.refs.judge).value = '';
																				React.findDOMNode(this.refs.grade).value = '';
																				return;
																				},
																				render: function() {
																				return (
																					<form className="commentForm" onSubmit={this.handleSubmit}>
																					<table className="table grades">
																					<tbody>
																					<tr>
																					<td><input type="text" placeholder="Student Name" ref="student" /><input type="submit" value="Add" /></td>
																					<td><input type="text" placeholder="Judge" ref="judge" /></td>
																					<td><input type="text" placeholder="Grade" ref="grade" /></td>
																					</tr>
																					</tbody>
																					</table>
																					</form>
																					);
																								}
});

var Grades = React.createClass({
displayName: 'Grades',
getInitialState: function() {
return {data: []};
},
getGrades: function () {
var url = "http://staging.fj.co/api/Grades";
$.ajax({
url: url,
dataType: 'json',
success: function(data) {
this.setState({data: data});
}.bind(this),
error: function(xhr, status, err) {
console.error(url, status, err.toString());
}.bind(this)
});
},
componentDidMount: function() {
this.getGrades();
setInterval(this.getGrades,'2000');
									 },
handleStudentSubmit: function(student) {
											 var newStudent = JSON.parse('{' + '"Student" : "' + student.student + '","judge" : "' + student.judge + '", "grade" : ' + student.grade + "}");
											 var students = this.state.data;
											 var newData = students.concat([newStudent]);
											 this.setState({data: newData});
											 var url = "http://staging.fj.co/api/save/grades";
											 var formData = JSON.stringify(student);
											 $.ajax({
url: url,
dataType: 'json',
type: 'POST',
data: formData,
success: function(data) {
this.setState({data: data});
}.bind(this),
error: function(xhr, status, err) {
//console.error(url, status, err.toString());
}.bind(this)
});
},
render: function () {
					return (
							<div className="pagecontent">
							<table className="table grades">
							<thead>
							<tr>
							<th>Name</th>
							<th>Assigned Judge</th>
							<th>Grade</th>
							</tr>
							</thead>
							<Students data={this.state.data} />
							</table>
							<GradeChangeForm onStudentSubmit={this.handleStudentSubmit} />
							</div>
							);
				}
});

var App = React.createClass({
displayName: 'Mobile Judge',

render: function() {
return (
	<div>
	<Header />
	<Grades />
	</div>
	);
}
});

React.render(<App/>, document.getElementById('content'));
