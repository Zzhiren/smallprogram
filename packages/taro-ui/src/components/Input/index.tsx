import React, { Fragment } from 'react'
import Taro from '@tarojs/taro'
import classNames from 'classnames'
import PropTypes, { InferProps } from 'prop-types'
import { View, Input as TInput, Label, Text } from '@tarojs/components'
import { BaseEventOrig, ITouchEvent } from '@tarojs/components/types/common'
import { InputProps as TInputProps } from '@tarojs/components/types/Input'
import {
  InputProps,
  InputStates,
  BlurEventDetail,
  ConfirmEventDetail,
  FocusEventDetail,
  InputEventDetail,
  KeyboardHeightEventDetail
} from '../../../types/input'

type PickInputProps = Pick<
  TInputProps,
  'maxlength' | 'disabled' | 'password'
  >
type GetInputPropsReturn = PickInputProps & Pick<TInputProps, 'type'>

function getInputProps(props: InputProps): GetInputPropsReturn {
  const actualProps = {
    type: props.type,
    maxlength: props.maxlength,
    disabled: props.disabled,
    password: false
  }

  switch (actualProps.type) {
  case 'phone':
    actualProps.type = 'number'
    actualProps.maxlength = 11
    break
  case 'password':
    actualProps.type = 'text'
    actualProps.password = true
    break
  default:
    break
  }
  if (!props.disabled && !props.editable) {
    actualProps.disabled = true
  }
  return actualProps as GetInputPropsReturn
}

export default class Input extends React.Component<InputProps, InputStates> {
  public static defaultProps: InputProps
  public static propTypes: InferProps<InputProps>

  public constructor (props: InputProps) {
    super(props)
    this.state = {}
  }

  private inputClearing = false

  private handleInput = (event: BaseEventOrig<InputEventDetail>): void => {
    this.props.onChange(event.detail.value, this.props.name, event)
  }

  private handleFocus = (event: BaseEventOrig<FocusEventDetail>): void => {
    if (typeof this.props.onFocus === 'function') {
      this.props.onFocus(event.detail.value, this.props.name, event)
    }
  }

  private handleBlur = (event: BaseEventOrig<BlurEventDetail>): void => {
    if (typeof this.props.onBlur === 'function') {
      this.props.onBlur(event.detail.value, this.props.name, event)
    }
    if (event.type === 'blur' && !this.inputClearing) {
      this.props.onChange(
        event.detail.value,
        this.props.name,
        event as BaseEventOrig<InputEventDetail>
      )
    }
    // ????????????
    this.inputClearing = false
  }

  private handleConfirm = (event: BaseEventOrig<ConfirmEventDetail>): void => {
    if (typeof this.props.onConfirm === 'function') {
      this.props.onConfirm(event.detail.value, this.props.name, event)
    }
  }

  private handleClick = (event: ITouchEvent): void => {
    if (!this.props.editable && typeof this.props.onClick === 'function') {
      this.props.onClick(event.detail.value, this.props.name, event)
    }
  }

  private handleClearValue = (event: ITouchEvent): void => {
    this.inputClearing = true
    this.props.onChange('', this.props.name, event)
  }

  private handleKeyboardHeightChange = (
    event: BaseEventOrig<KeyboardHeightEventDetail>
  ): void => {
    if (typeof this.props.onKeyboardHeightChange === 'function') {
      this.props.onKeyboardHeightChange(this.props.name, event)
    }
  }

  public render (): JSX.Element {
    const {
      name = '',
      className = '',
      value,
      placeholder = '?????????',
      placeholderStyle,
      placeholderClass,
      cursorSpacing = -1,
      confirmType = 'done',
      alwaysEmbed = false,
      cursor = -1,
      border,
      selectionStart = -1,
      selectionEnd = -1,
      adjustPosition = true,
      holdKeyboard = false,
      label = '',
      customLabel = false,
      clearable = false,
      align = 'left',
      required = false,
      error = '',
      autoFocus = false,
      focus = false,
    } = this.props
    const isRenderError = !!this.props.renderError || error
    const { type = 'text', maxlength = 140, disabled = false, password } = getInputProps(this.props)
    const rootClass = classNames(
      'ag-input',
      {
        'ag-input--without-border': !border
      },
      className
    )

    const containerCls = classNames('ag-input__container', {
      'ag-input--disabled': disabled
    })
    const overlayCls = classNames('ag-input__overlay', {
      'ag-input__overlay--hidden': !disabled
    })
    const placeholderCls = classNames('ag-input__placeholder', placeholderClass)
    return (
      <View className={rootClass}>

        {align === 'top' && (
          <Label
            className={`ag-input__top-label ${required && 'ag-input__label--required'}`}
            for={name}
          >
            {label}
          </Label>
        )}

        <View className={containerCls}>
          <View className={overlayCls} onClick={this.handleClick}/>
          {align === 'left' && (
            <Fragment>
              {customLabel ?
                <View>{this.props.renderLabel}</View>
                :
                <Label
                  className={`ag-input__left-label ${required && 'ag-input__label--required'}`}
                  for={name}
                >
                  {label}
                </Label>
              }
            </Fragment>
          )}

          <TInput
            className='ag-input__input'
            id={name}
            value={value}
            type={type}
            password={password}
            placeholder={placeholder}
            placeholderStyle={placeholderStyle}
            placeholderClass={placeholderCls}
            maxlength={maxlength}
            cursorSpacing={cursorSpacing}
            confirmType={confirmType}
            alwaysEmbed={alwaysEmbed}
            cursor={cursor}
            selectionStart={selectionStart}
            selectionEnd={selectionEnd}
            adjustPosition={adjustPosition}
            holdKeyboard={holdKeyboard}
            autoFocus={autoFocus}
            focus={focus}
            onInput={this.handleInput}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onConfirm={this.handleConfirm}
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            onKeyboardHeightChange={this.handleKeyboardHeightChange}
          />

          {clearable && value && (
            <View className='ag-input__clear' onTouchEnd={this.handleClearValue}>
              <Text className='ag-icon ag-icon-close-circle ag-input__icon-close'/>
            </View>
          )}

          <View className='ag-input__custom-right'>{this.props.renderRight}</View>

        </View>
        {isRenderError && (
          <View className='ag-input__tip'>
            {align === 'left' && (
              <Fragment>
                {customLabel ?
                  <View className='ag-input__tip-box'>{this.props.renderLabel}</View>
                  :
                  <Label
                    className={`ag-input__left-label`}
                  >
                  </Label>
                }
              </Fragment>
            )}
            {this.props.renderError ?
              <View className='ag-input__tip-label'>
                {this.props.renderError}
              </View>
              :
              <View className='ag-input__tip-label'>{error}</View>
            }
          </View>
        )}

      </View>
    )
  }
}

// @ts-ignore
// @ts-ignore
Input.defaultProps = {
  name: '',
  className: '',
  /* input?????? */
  value: '',
  /**
   * ???????????????
   * @default text
   */
  type: 'text',
  error: '',
  /* ????????????????????? */
  password: false,
  /* ???????????? */
  placeholder: '?????????',
  /* ??????placeholder????????? */
  placeholderStyle: '',
  /* ??????placeholder???class */
  placeholderClass: '',
  /* ???????????? */
  disabled: false,
  /* ??????????????? */
  editable: true,
  /* ?????????????????? */
  maxlength: 140,
  /**
   * ???????????????????????????????????? input ???????????????????????? cursor-spacing ?????????????????????????????????????????????????????????
   * @default 0
   */
  cursorSpacing: -1,
  /**
   * ?????????????????????????????????????????????type='text'?????????
   * @default done
   */
  confirmType: 'done',
  /**
   * ?????? input ??????????????????????????? focus ??? input ???????????????????????? (?????? iOS ?????????)
   * @default false
   */
  alwaysEmbed: false,
  /* ??????focus?????????????????? */
  cursor: -1,
  /**
   * ???????????????????????????????????????????????????selection-end????????????
   * @default -1
   */
  selectionStart: -1,
  /**
   * ???????????????????????????????????????????????????selection-start????????????
   * @default -1
   */
  selectionEnd: -1,
  /**
   * ??????????????????????????????????????????
   * @default true
   */
  adjustPosition: true,
  /**
   * focus??????????????????????????????????????????
   * @default false
   */
  holdKeyboard: false,


  /* ?????? */
  label: '',
  /* ???????????????label */
  customLabel: false,
  /* ???????????????????????? */
  clearable: false,
  /**
   * label???????????????top|left
   * @default left
   */
  border: true,
  align: 'left',
  /* ????????????,???????????????????????? */
  required: false,
  /* ???????????? */
  rightIcon: '',
  /**
   * ??????????????????
   * @default false
   */
  focus: false,
  onChange: (): void => {},
  onFocus: (): void => {},
  onBlur: (): void => {},
  onConfirm: (): void => {},
  onKeyboardHeightChange: (): void => {},

  // renderCustomLabel: null,
  // renderTip: null
  // onFocus: (detail: InputProps.inputForceEventDetail): void => {},
  // onBlur: (detail: InputProps.inputValueEventDetail): void => {},
  // onConfirm: (detail: InputProps.inputValueEventDetail): void => {},
  // onKeyboardHeightChange: (detail: InputProps.onKeyboardHeightChangeEventDetail): void => {}
}

Input.propTypes = {
  className: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
}
