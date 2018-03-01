import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import VM from 'scratch-vm';
import xhr from 'xhr';
import md5 from 'md5';
import ButtonComponent from '../components/button/button.jsx';
import {setProject} from '../reducers/project';
import { ASSETS_ROOT } from '../api-config';

class SaveCloudButton extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleClick',
            'saveCostumes'
        ]);
    }
    handleClick () {
        // TODO: UltraBear
        // Even after we edit the stage costume in paint. The format of it is still png, not svg, which is actually svg now.
        // Is it a scratch bug or not consider format yet? I see a "Convert to Bitmap in paint area", seems not implemented.
        let json = this.props.saveProjectSb3();

        let hash = md5(json);
        let projectId = md5(this.props.user.id) + hash;
        let name = "new project by" + this.props.user.id;
        
        // Project NOT changed
        if (this.props.project.owner == this.props.user.id) {
            projectId = this.props.project.id
        }
        
        xhr({
            method: "POST",
            url: ASSETS_ROOT + "/projects",
            body: JSON.stringify({
                id: projectId,
                name: this.props.project.name,
                owner: this.props.user.id,
                hash: hash,
                data: json
            }),
        }, (err, response, body) => {
            if (!err) {
                if ( this.props.project.owner == this.props.user.id ) {
                    alert("保存成功");
                }
                else {
                    alert("上传成功，项目代码 ：" + projectId);
                }
                console.log("project saved");
                this.props.setProject({
                    id: projectId,
                    name: name,
                    owner: this.props.user.id,
                    hash: hash,
                });
            }
        });

        this.saveCostumes();
    }
    saveCostumes() {
        if (!window.FormData) {
            throw new Error("Unsupported browser");
        }
        for (const key in this.props.sprites) {
            if (!this.props.sprites.hasOwnProperty(key)) continue;
            this.uploadSpriteCostumes(this.props.sprites[key]);
        }
        this.uploadStageCostumes(this.props.stage);
    }
    uploadSpriteCostumes(sprite) {
        this.uploadSVG(sprite, ASSETS_ROOT + "/custumes");
    }
    uploadStageCostumes(sprite) {
        this.uploadSVG(sprite, ASSETS_ROOT + "/backdrops");
    }
    uploadSVG(sprite, url) {
        if (!sprite || !sprite.costumes) return;
        for (let i = 0; i < sprite.costumes.length; i++) {
            let form = new window.FormData();
            let svgStr = this.props.vm.getSvg(sprite.costumes[i].assetId);
            let svg = new Blob([svgStr], {type:"image/svg+xml;charset=utf-8"});

            form.append('file', svg, "user_edited_"+md5(svg)+".svg");
            form.append('name', "user_edited_"+md5(svg));
            form.append('center_x', sprite.costumes[i].rotationCenterX);
            form.append('center_y', sprite.costumes[i].rotationCenterY);
            form.append('resolution', sprite.costumes[i].bitmapResolution);
            form.append('format', 'svg');
    
            xhr({
                method: "POST",
                url: url,
                body: form,
            }, (err, response, body) => {
                if (!err) {
                    console.log("new svg saved");
                }
            });
        }
    }
    render () {
        const {
            saveProjectSb3, // eslint-disable-line no-unused-vars
            setProject,
            ...props
        } = this.props;
        return (
            <ButtonComponent
                onClick={this.handleClick}
                {...props}
            >
                保存
            </ButtonComponent>
        );
    }
}

SaveCloudButton.propTypes = {
    saveProjectSb3: PropTypes.func.isRequired,
    vm: PropTypes.instanceOf(VM)
};

const mapStateToProps = state => ({
    sprites: state.targets.sprites,
    stage: state.targets.stage,
    vm: state.vm,
    saveProjectSb3: state.vm.saveProjectSb3.bind(state.vm),
    project: state.project,
    user: state.user,
});

const mapDispatchToProps = dispatch => ({
    setProject: (project) => dispatch(setProject(project)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SaveCloudButton);