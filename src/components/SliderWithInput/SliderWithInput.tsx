/* eslint-disable no-unused-vars */
import { Slider, InputNumber } from 'antd';
import React from 'react';
import styles from './SliderWithInput.module.scss';

interface ComponentProps {
    min: number;
    max: number;
    value: number;
    step?: number;
    sliderWidth?: number;
    trackColor?: string;
    onChangeListener: (changedValue: number) => void;
}
interface ComponentState {}

class SliderWithInput extends React.Component<ComponentProps, ComponentState> {
    constructor(props: ComponentProps) {
        super(props);
        this.state = {
            value: 0,
        };
    }

    render() {
        return (
            <div className={styles.sliderContainer}>
                <Slider
                    className={styles.slider}
                    min={this.props.min}
                    max={this.props.max}
                    value={this.props.value}
                    step={this.props.step ? this.props.step : 1}
                    onChange={this.onChange}
                    trackStyle={{
                        backgroundColor: this.props.trackColor ? this.props.trackColor : 'brown',
                    }}
                    handleStyle={{
                        border: this.props.trackColor ? `${this.props.trackColor} 2px solid` : 'brown 2px solid',
                        width: 10,
                        height: 10,
                        marginTop: -3,
                    }}
                    style={{
                        width: this.props.sliderWidth ? this.props.sliderWidth : 120,
                    }}
                ></Slider>
                <InputNumber size={'small'} className={styles.inputNumber} value={this.props.value} step={this.props.step ? this.props.step : 1} onChange={this.onChange}></InputNumber>
            </div>
        );
    }

    private onChange = (changedValue: number | string | undefined | null) => {
        if (typeof changedValue === 'number') {
            this.props.onChangeListener(changedValue);
        }
    };
}

export default SliderWithInput;
