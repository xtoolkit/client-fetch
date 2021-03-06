import {Api} from '@client-fetch/core';
import React, {
  createContext,
  createElement,
  useContext,
  useEffect,
  useState
} from 'react';
import type {
  Request,
  ApiOptions,
  ExecutesArgs,
  ExecuteMethod
} from '@client-fetch/core';

let ApiContext: React.Context<Api>;

interface ApiReactInstallOptions {
  request: Request;
  options?: ApiOptions;
  app?: any;
}

export function install({request, options = {}, app}: ApiReactInstallOptions) {
  if (ApiContext) {
    throw new Error('Api before installed');
  }
  const api = new Api(options, request);
  if (app) {
    api.setApp(app);
  }
  ApiContext = createContext(api);
}

export function useApi() {
  if (!ApiContext) {
    throw new Error('Please first install Api');
  }
  return useContext(ApiContext);
}

export function useRunApi<Fn extends ExecuteMethod | undefined = undefined>(
  ...[method, input]: ExecutesArgs<Fn>
) {
  const api = useApi();
  const [state, setState] = useState(Api.createRes());
  const onEach = function (this: any) {
    input?.onEach?.apply(this);
    setState({...this});
  };
  useEffect(() => {
    // @ts-ignore
    api.execute(method, {...input, onEach});
  }, []);
  return state;
}

export function withApi<T extends {new (...args: any[]): React.Component}>(
  component: T
) {
  const ApiComponent = function (
    props: ConstructorParameters<typeof component>[0]
  ) {
    const origin = new component(props) as any;
    if (origin.api) {
      if (!origin.state) {
        origin.state = {};
      }
      for (const key in origin.api) {
        origin.state[key] = Api.createRes();
      }
    }
    return origin;
  };

  const onMount = component.prototype.componentDidMount;
  ApiComponent.prototype = component.prototype;

  function ComponentWithApiContextProp(
    props: ConstructorParameters<typeof component>[0]
  ) {
    const $api = useApi();

    ApiComponent.prototype.componentDidMount = function () {
      const self = this;
      onMount?.apply(self);
      if (!self.api) {
        return false;
      }
      for (const item in self.api) {
        const api = self.api[item];
        const config = typeof api === 'function' ? api.apply(self) : api;
        if (Object.keys(config).length === 0) {
          continue;
        }
        const onEach = function (this: any, data: any) {
          config?.onEach?.apply(this);
          self.setState({[item]: {...this}});
        };
        $api.execute(config.manual ? 'manual' : config.method, {
          ...config,
          onEach
        });
      }
    };
    return createElement(ApiComponent, {...props});
  }
  return ComponentWithApiContextProp;
}

export {ApiContext as UNSAFE_ApiContext};
