import React, { Component } from 'react';
import moment from 'moment';


class PaymentRequiredWarning extends Component {
  render() {
    return(
      <div className='alert alert-danger' role='alert'>
        <h5><strong>Acesso indisponível</strong></h5>
        Não é possível efetuar inscrição nesse tipo de atividade pois é exigida aprovação pelo
          Módulo de Pagamento. Acesse o menu <strong>Pagamento</strong> para ter mais instruções.
      </div>
    );
  }
}

class EnrollButton extends Component {
  render() {
    return(
    <span><a className={"btn btn-" + this.props.style}
        onClick={this.props.onClick}
        target="blank_">
        {this.props.text}
    </a>{' '}</span>
    )
  }
}

class SeeAllObjectsEnrolledPane extends Component {
  constructor(props) {
    super(props);

    this.exit = this.exit.bind(this);
    this.checkEnrollment = this.checkEnrollment.bind(this);
  }

  componentDidMount() {
    this.props.loadObjects(this.props.entity, this.props.userSession.logged_user.id);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.entity !== this.props.entity) {
      this.props.loadObjects(this.props.entity, this.props.userSession.logged_user.id);
    }
  }

  exit(enrollObject) {
      this.props.exit(this.props.entity, enrollObject);
  }

  checkEnrollment(object) {
    const sessions = Array.from((this.props.listOfEnrolledSessions.map(obj => obj.sessions)).reduce((arr, e) => arr.concat(e), []));
    const matchingList = object.sessions.reduce((filtered, option) => {
      if(sessions.filter(obj => !(obj.finalDate <= option.initialDate || obj.initialDate >= option.finalDate)).length !== 0) {
        filtered.push(1);
      }
      return filtered;
    }, []);
    return matchingList;
  }

  render() {
    return(
      <div>
        <h5><strong>Todas propostas inscritas{' '}
          { this.props.allObjectsUserEnrolled &&
            `(${this.props.allObjectsUserEnrolled.length})`
          }
        </strong></h5>
        <table className='table'>
          <thead>
            <tr>
              <th>Atividade</th>
              <th>Propositores</th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.allObjectsUserEnrolled &&
              this.props.listOfEnrolledSessions &&
              this.props.allObjectsUserEnrolled.filter(obj => !obj.data.deleted).map((object) => {
                const userEnrollment = object.data.ofEnrollments.find(enrollment => enrollment.user == this.props.userSession.logged_user.id);
                return (
                  <tr key={object._id}>
                    <td>
                      <strong>{object.data.title}</strong>
                      <br/>
                      <strong>Tipo de atividade</strong>{' '}
                      {
                        object.entity === 'minicourse' ? 'Minicurso':
                        object.entity === 'workshop' ? 'Oficina':
                        object.entity === 'conference' ? 'Conferência':
                        object.entity === 'roundtable' ? 'Mesa-Redonda': ''
                      }
                      <br/>
                      <strong>Vagas preenchidas</strong>:{object.data.ofEnrollments.length} de { object.data.consolidation ? object.data.consolidation.vacancies : 'Isso não devia estar acontecendo' }
                      <strong>Horários</strong>:{' '}
                      { object.data.consolidation &&
                        object.data.consolidation.sessions.map((session) => {
                          const initialDate = new Date(session.initialDate)
                          const finalDate = new Date(session.finalDate)
                          return (
                             `${initialDate.getDate()}/${initialDate.getMonth()+1}/${initialDate.getFullYear()} a partir de ${initialDate.getHours()}:${initialDate.getMinutes()} até ${finalDate.getHours()}:${finalDate.getMinutes()}` + '\n'
                          );
                        })
                      }
                      <br/>
                      <strong>Local</strong>:{' '}
                      { object.data.consolidation &&
                          <span>{ object.data.consolidation.location }</span> 
                      }
                      <br/>
                      <p style={{textAlign: 'justify'}}>
                      <strong>Ementa</strong>: { object.data.syllabus }</p>
                      { object.data.ofFields &&
                        object.data.ofFields.filter(field => field.request.name == "debaters").map((field) => {
                          return (
                            <p key={field._id} style={{textAlign: 'justify'}}>
                              <strong>{field.request.readableName}</strong>: {field.value}
                            </p>
                          );
                        })
                      }
                      { object.data.consolidation &&
                        !this.props.enrollmentePeriodEnd &&
                        !object.data.ofEnrollments.map(enrollment => enrollment.user).includes(this.props.userSession.logged_user.id) &&
                        <EnrollButton onClick={() => this.enroll({ activityId: object._id,
                          userId: this.props.userSession.logged_user.id,
                          sessions: object.data.consolidation.sessions})}
                          style={'primary'} text={'Inscrever-se'} />
                      }
                      { object.data.consolidation &&
                        !this.props.enrollmentePeriodEnd &&
                        object.data.ofEnrollments.map(enrollment => enrollment.user).includes(this.props.userSession.logged_user.id) &&
                        <EnrollButton onClick={() => this.exit({ activityId: object._id,
                          userId: this.props.userSession.logged_user.id,
                          sessions: object.data.consolidation.sessions})}
                          style={'danger'} text={'Desfazer inscrição'} />
                      }
                      {
                        object.data.ofEnrollments.map(enrollment => enrollment.user).includes(this.props.userSession.logged_user.id) &&
                        userEnrollment &&
                        userEnrollment.cert &&
                        this.props.payed &&
                        <a target='_blank' href={`/certificado/${userEnrollment.cert}`} className='btn btn-primary'>Certificado</a>
                      }
                      { object.data.consolidation &&
                        this.checkEnrollment({ sessions: object.data.consolidation.sessions, entity: this.props.entity}) != 0 &&
                        !object.data.ofEnrollments.map(enrollment => enrollment.user).includes(this.props.userSession.logged_user.id) &&
                        <p>Você já está inscrito em uma atividade que conflita com essa em relação a horários</p>
                      }
                    </td>
                    <td>
                      {
                        object.data.ofProposersUsers.map((author) => {
                          return (<span key={author._id}>{`${author.name} (${author.email})`}<br/></span>)
                        })
                      }
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
    );
  }
}


class SeeAllObjectsUserEnrolled extends Component {

  componentDidMount() {
    this.props.loadThematicGroups();
  }

  render() {
    if (this.props.activities.entity) {
      let thematicGroupsCoordinators = this.props.thematicGroups.thematicGroups.map(object => object.data.coordinators);
      thematicGroupsCoordinators = Array.from(thematicGroupsCoordinators.reduce((arr, e) => arr.concat(e), [])).map(object => object._id);
      const entity = this.props.activities.entity;
      const listOfProposers = Array.from(this.props.allObjectsToEnroll.map(object => object.data.ofProposersUsers.map(user => user._id))).reduce((arr, e) => arr.concat(e), []);
      let payed = true;
      // Handle payment requirement
      if (entity.data.requirePayment === true) {
        if (this.props.payment.approved === false) {
          if(!listOfProposers.includes(this.props.userSession.logged_user.id) && !thematicGroupsCoordinators.includes(this.props.userSession.logged_user.id))
            payed = false;
          } else {
            payed = true;
          }
      }

      const now = new Date();
      const enrollmentPeriodBegin = new Date(entity.data.enrollmentPeriod.begin);
      const enrollmentPeriodEnd = new Date(entity.data.enrollmentPeriod.end);
      let enrollmentePeriodEnd = true;
      if (enrollmentPeriodBegin < now && now < enrollmentPeriodEnd) {
        enrollmentePeriodEnd = false;
      }


          return (<SeeAllObjectsEnrolledPane entity={this.props.entity}
            userSession={this.props.userSession}
            allObjectsUserEnrolled={this.props.allObjectsUserEnrolled}
            listOfEnrolledSessions={this.props.listOfEnrolledSessions}
            loadObjects={this.props.loadObjects}
            payed={payed}
            enrollmentePeriodEnd={enrollmentePeriodEnd}
            exit={this.props.exit}
            />);
    } else {
      return (<div>Desenvolvendo B</div>);
    }
  }
}

export default SeeAllObjectsUserEnrolled;
