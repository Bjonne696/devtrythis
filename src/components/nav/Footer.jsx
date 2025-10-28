import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa6";
import {
  FooterContainer,
  FooterContent,
  FooterColumn,
  FooterSpan,
  FooterLink,
  SocialLinks,
  IconWrapper
} from '../../styles/layout/navigationStyles';

export default function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterColumn>
          <p><FooterSpan>Bedrift:</FooterSpan> Berge Hyttene - Eid av Anita Berge</p>
          <p><FooterSpan>Org.nr:</FooterSpan> 926 576 259</p>
          <p><FooterSpan>E-post:</FooterSpan> Anitaberge@yahoo.no</p>
        </FooterColumn>
        <FooterColumn>
          <p>www.berge-hyttene.no</p>
          <p><FooterLink to="/salgsbetingelser">Salgsbetingelser</FooterLink></p>
          <p><FooterLink to="/personvern">Personvern</FooterLink></p>
        </FooterColumn>
        <FooterColumn>
          <SocialLinks>
            <IconWrapper><FaFacebookF /></IconWrapper>
            <IconWrapper><FaTiktok /></IconWrapper>
            <IconWrapper><FaInstagram /></IconWrapper>
          </SocialLinks>
        </FooterColumn>
      </FooterContent>
    </FooterContainer>
  );
}