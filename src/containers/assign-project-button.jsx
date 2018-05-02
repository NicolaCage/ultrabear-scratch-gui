import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import ButtonComponent from '../components/button/button.jsx';
import { ASSETS_ROOT } from '../api-config';
import {openAssignProjectWindow} from '../reducers/modals'

class AssignProjectButton extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleClick',
            'copyProject',
        ]);
    }

    handleClick () {
        this.copyProject(this.props.project.id);
    }

    copyProject(projectId) {
        if(!projectId) {
            alert("请先保存到云端");
            return
        }
        let studentUId = prompt("请输入学生的Unionid:");
        let newProjectId = projectId + "_" + studentUId;
        let config = {
            headers:{
                jwt:this.props.user.jwt,
                'Content-Type':'multipart/form-data'
            },
        }

        axios.post(ASSETS_ROOT + "/projects/" + projectId, {
            id: newProjectId,
            name: this.props.project.name,
            unionid: studentUId
        }, config)
        .then((res)=>{
            if (res.data.code==0){
                alert("上传成功，项目代码 ：" + newProjectId);
            }
            else {
                alert('提交失败');
            }
        })
        .catch(error=>{
            alert("网络错误" + error)
        });
    }

    render () {
        const {
            onClicked,
            ...props
        } = this.props;
        return (
            <section
                style= {{cursor: "pointer"}}
                onClick={this.handleClick}
            >
                分发脚本
            </section>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user,
    project: state.project,
});

const mapDispatchToProps = dispatch => ({
    
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AssignProjectButton);
