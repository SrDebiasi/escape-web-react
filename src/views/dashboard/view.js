import React from 'react';
import {Col, Row} from "react-bootstrap";
import WidgetSchedulesList from '../../components/dashboard/widget/schedules-list'
import WidgetSchedules from '../../components/dashboard/widget/schedules'
import WidgetTimetables from '../../components/dashboard/widget/timetables'
import WidgetRevenue from '../../components/dashboard/widget/revenue'
import SummarySchedules from '../../components/dashboard/summary/schedules'
import SummaryOccupancy from '../../components/dashboard/summary/occupancy'
import SummaryRevenue from '../../components/dashboard/summary/revenue'
import {Container} from "@material-ui/core";

export default function Dashboard() {

    return (
        <>
            <Row className="m-2">
                <Col>
                    <WidgetSchedulesList/>
                </Col>
            </Row>
            <Row className="m-2">
                <Col md={4}>
                    <WidgetSchedules/>
                </Col>
                <Col md={4}>
                    <WidgetTimetables/>
                </Col>
                <Col md={4}>
                    <WidgetRevenue/>
                </Col>
            </Row>
            <Row className="mx-2">
                <Col md={4} className="mt-4">
                    <SummarySchedules/>
                </Col>
                <Col md={4} className="mt-4">
                    <SummaryOccupancy/>
                </Col>
                <Col md={4} className="mt-4">
                    <SummaryRevenue/>
                </Col>
            </Row>
        </>
    );
}

