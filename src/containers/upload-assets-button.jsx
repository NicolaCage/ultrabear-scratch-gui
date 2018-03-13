import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import xhr from 'xhr';
import md5 from 'md5';
import LoadButtonComponent from '../components/load-button/load-button.jsx';
import { ASSETS_ROOT } from '../api-config';

const TypesAllowed = {
    "png": true,
    "svg": true,
    "bmp": true,
    "jpg": true,
    "wav": true,
}

class UploadAssetsButton extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'setFileInput',
            'handleChange',
            'handleClick',
            'loadAsset',
            'sendAsset'
        ]);
    }

    handleChange (e) {
        const reader = new FileReader();
        const file = e.target.files[0];
        reader.onload = () => this.loadAsset(file, reader.result);
        // Always read in base64
        reader.readAsDataURL(e.target.files[0]);
    }

    sendAsset(url, payload) {
        xhr({
            method: "POST",
            url: url,
            body: JSON.stringify(payload),
        }, (err, response, body) => {
            body = JSON.parse(body)
            if (!err && body.code == 0) {
                alert("上传素材成功");
            }
            else {
                alert("上传素材失败: " + body.msg);
            }
        });
    }

    loadAsset(file, data) {
        let ext = file.name.substr(file.name.lastIndexOf('.') + 1);
        if (!data || !ext) {
            alert("上传文件为空或者无后缀名")
            return;
        }
        if (!TypesAllowed.hasOwnProperty(ext)) {
            alert("不支持该文件格式")
            return;
        }

        if (ext == "wav") {
            let url = ASSETS_ROOT + "/sounds";
            let name = prompt('请输入素材名字');
            let rate = parseInt(prompt('请输入采样率'));
            let sampleCount = parseInt(prompt('请输入采样数'));

            let payload = {
                file : data, 
                name : name, 
                rate: rate, 
                sampleCount: sampleCount, 
                format : ext, 
            }
            this.sendAsset(url, payload);
        }
        else {
            var isCustume = confirm("该素材是一个造型吗? 舞台请点取消");
            if (isCustume) {
                let url = ASSETS_ROOT + "/custumes";
                let name = prompt('请输入素材名字');
                let center_x = parseInt(prompt('请输入X方向中心点坐标'));
                let center_y = parseInt(prompt('请输入Y方向中心点坐标'));
                let resolution = parseInt(prompt('请输入分辨率'));

                let payload = {
                    file : data, 
                    name : name, 
                    center_x : center_x, 
                    center_y : center_y, 
                    resolution : resolution, 
                    format : ext, 
                }
                this.sendAsset(url, payload);
            }
            else {
                let url = ASSETS_ROOT + "/backdrops";
                let name = prompt('请输入素材名字');
                let width = parseInt(prompt('请输入宽度'));
                let height = parseInt(prompt('请输入高度'));
                let resolution = parseInt(prompt('请输入分辨率'));

                let payload = {
                    file : data, 
                    name : name, 
                    height: height, 
                    width : width, 
                    resolution : resolution, 
                    format : ext, 
                }
                this.sendAsset(url, payload);
            }
        }
    }

    handleClick () {
        this.fileInput.click();
    }
    setFileInput (input) {
        this.fileInput = input;
    }
    render () {
        const {
            loadProject, // eslint-disable-line no-unused-vars
            ...props
        } = this.props;
        return (
            <LoadButtonComponent
                inputRef={this.setFileInput}
                onChange={this.handleChange}
                onClick={this.handleClick}
                title = "上传素材"
                {...props}
            />
        );
    }
}

UploadAssetsButton.propTypes = {
    loadProject: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    loadProject: state.vm.fromJSON.bind(state.vm)
});

export default connect(
    mapStateToProps,
    () => ({}) // omit dispatch prop
)(UploadAssetsButton);
