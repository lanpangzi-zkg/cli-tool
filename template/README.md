#Installation
###By npm
1.临时使用
npm --registry  http://10.0.1.244:8081/repository/npm/ install fulu
2.持久使用
npm config set registry  http://10.0.1.244:8081/repository/npm/
npm install fulu --save

#Usage
```
import Flayout from 'fulu';

<Router history={history}>
      <Flayout >
        <Switch>
          <Route path="/" exact component={IndexPage} />
          <Route path="/user" exact component={User} />
        </Switch>
      </Flayout>
    </Router>
```
