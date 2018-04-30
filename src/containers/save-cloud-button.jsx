import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import VM from 'scratch-vm';
import axios from 'axios';
import md5 from 'md5';
import ButtonComponent from '../components/button/button.jsx';
import styles from '../components/button/button.css';
import {setProject} from '../reducers/project';
import { ASSETS_ROOT } from '../api-config';

class SaveCloudButton extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleClick',
            'saveCostumes',
            'uploadCostumes',
            'uploadSpriteCostumes',
            'uploadSounds'
        ]);
    }
    handleClick () {
        // TODO: UltraBear
        // Even after we edit the stage costume in paint. The format of it is still png, not svg, which is actually svg now.
        // Is it a scratch bug or not consider format yet? I see a "Convert to Bitmap in paint area", seems not implemented.
        let json = this.props.toJSON();
        let hash = md5(json);
        // let projectId = md5(this.props.user.id) + hash;
        let projectId = hash;
        let name = prompt("给项目起个名字吧：");
        if (!name) {
            return;
        }
        // Project NOT changed
        if (this.props.project.owner == this.props.user.id) {
            projectId = this.props.project.id
        }

        let config = {
            headers:{
                jwt:this.props.user.jwt,
                'Content-Type':'multipart/form-data'
            },
        }
        axios.post(ASSETS_ROOT + "/projects", {
            id: projectId,
            name: name,
            owner: this.props.user.id,
            hash: hash,
            data: json
        }, config)
        .then((res)=>{
            if (res.data.code==0){
                //不是很对，需要区分另存为和保存
                if (this.props.project.owner == this.props.user.id ) {
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
            else {
                alert('提交失败');
            }
        })
        .catch(error=>{
            alert("网络错误" + error)
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
        this.uploadCostumes(sprite, ASSETS_ROOT + "/costumes");
        this.uploadSounds(sprite, ASSETS_ROOT + "/sounds");
    }
    uploadStageCostumes(sprite) {
        this.uploadCostumes(sprite, ASSETS_ROOT + "/backdrops");
        this.uploadSounds(sprite, ASSETS_ROOT + "/sounds");
    }

    uploadCostumes(sprite, url) {
        if (!sprite || !sprite.costumes) return;
        for (let i = 0; i < sprite.costumes.length; i++) {
            let costume = sprite.costumes[i];
            let storage = this.props.vm.runtime.storage;
            let assetType = (costume.dataFormat.includes('svg')) ? storage.AssetType.ImageVector: storage.AssetType.ImageBitmap;
            storage.load(assetType, costume.assetId, costume.dataFormat)
            .then(
                asset => {
                    if (asset != null) {
                        let form = new window.FormData();
                        let hash = asset.assetId;
                        let blobdata = new Blob([asset.data], {type:asset.assetType.contentType});
                        form.append('file', blobdata, hash + "." + asset.dataFormat);
                        form.append('name', hash);
                        form.append('center_x', costume.rotationCenterX);
                        form.append('center_y', costume.rotationCenterY);
                        form.append('resolution', costume.bitmapResolution);
                        form.append('format', asset.dataFormat);

                        let config = {
                            headers:{
                                jwt:this.props.user.jwt,
                                'Content-Type':'multipart/form-data'
                            },
                        }
                        axios.post(url, form, config)
                        .then((res)=>{
                            if (res.data.code==0){
                                
                            }
                            else {
                                // alert('提交失败');
                            }
                        })
                        .catch(error=>{
                            alert("网络错误" + error)
                        });

                    } else {
                       debugger
                    }
                },
                error => {
                    errors.push(error);
                    // TODO: maybe some types of error should prevent trying the next helper?
                }
            );
        }
    }

    uploadSounds(sprite, url) {
        if (!sprite || !sprite.sounds) return;
        for (let i = 0; i < sprite.sounds.length; i++) {
            let sound = sprite.sounds[i];
            let storage = this.props.vm.runtime.storage;
            let assetType = (sound.dataFormat.includes('svg')) ? storage.AssetType.ImageVector: storage.AssetType.ImageBitmap;
            storage.load(assetType, sound.assetId, sound.dataFormat)
            .then(
                asset => {
                    if (asset != null) {
                        let form = new window.FormData();
                        let hash = asset.assetId;
                        let blobdata = new Blob([asset.data], {type:asset.assetType.contentType});
                        form.append('file', blobdata, hash + "." + asset.dataFormat);
                        form.append('name',hash);
                        form.append('rate', sound.rate);
                        form.append('sample_count', sound.sampleCount);
                        form.append('format', asset.dataFormat);

                        let config = {
                            headers:{
                                jwt:this.props.user.jwt,
                                'Content-Type':'multipart/form-data'
                            },
                        }
                        axios.post(url, form, config)
                        .then((res)=>{
                            if (res.data.code==0){
                                
                            }
                            else {
                                // alert('提交失败');
                            }
                        })
                        .catch(error=>{
                            alert("网络错误" + error)
                        });

                    } else {
                       debugger
                    }
                },
                error => {
                    errors.push(error);
                    // TODO: maybe some types of error should prevent trying the next helper?
                }
            );
        }
    }

    render () {
        const {
            toJSON, // eslint-disable-line no-unused-vars
            setProject,
            ...props
        } = this.props;
        return (
            <section
                onClick={this.handleClick}
                {...props}
            >
                保存到云端
            </section>
        );
    }
}

SaveCloudButton.propTypes = {
    toJSON: PropTypes.func.isRequired,
    vm: PropTypes.instanceOf(VM)
};

const mapStateToProps = state => ({
    sprites: state.targets.sprites,
    stage: state.targets.stage,
    vm: state.vm,
    toJSON: state.vm.toJSON.bind(state.vm),
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